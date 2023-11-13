import cv2
import numpy as np
from pyzbar import pyzbar
from itertools import combinations
from scipy.optimize import linear_sum_assignment

import cv2
import numpy as np
import sys

from find_barcode import decode_barcode

# TODO: нужно вывести все константы наверх

def get_binarized_image(path):
    """
    Подготавливает бинаризированное изображение без баркода.
    
    Параметры:
        path: строка, содержащая путь к изображению.
    
    Возвращаемое значение:
        binarized: структура изображения из библиотеки CV с примененными изменениями (бинаризация и удаление баркода)
    """
    image = cv2.imread(path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binarized = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Закрасим баркод белым прямоугольником, чтобы он не мешал
    barcode_img = cv2.imread(path)
    _, barcode = decode_barcode(barcode_img)
    if barcode is not None:
        cv2.fillPoly(binarized, [np.array(barcode)], (255, 255, 255))
    
    return binarized

def crop_img(image, x, y, width, height, target_width, target_height):
    """
    Вырезает указанную область изображения и нормализует его как по цвету, так и по размеру. 
    
    Parameters:
        image: исходное изображения.
        x, y: координаты верхнего левого угла ограничивающей рамки, которая будет вырезана.
        width, height: размеры вырезаемой ограничивающей рамки.
        target_width, target_height: размеры, к которым будет нормализовано изображение.
    
    Returns:
        new_img: структура изображения из библиотеки CV
    """
    
    cropped_img = image[y:y+height, x:x+width]
    resized_img = cv2.resize(cropped_img, (target_width, target_height))
    
    if len(resized_img.shape) == 3: 
        new_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2GRAY)
    else:
        new_img = resized_img
    
    return new_img

def get_ground_truth_score(image):
    """
    Находит и формализует паттерн детекций маркировки логотипа на эталоне. 
    Паттерн формализуется в виде списка векторов расстояний от произвольного элемента логотипа до всех остальных.
    
    Parameters:
        image: исходное изображения.
    
    Returns:
        image_color: изображение с разметкой (чисто для debug)
        centroid_scores: список векторов от центра произвольного элемента до центров всех остальных элементов
        detections: список нормализованных изображений отдельных элементов распознанного логотипа
    """
    image_color = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    detections = []

    # Находим ограничивающую рамку стенки коробки чтобы избавиться от мусора
    contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    largest_contour = contours[0]
    x, y, w, h = cv2.boundingRect(largest_contour)
    cropped_box = image[y:y+h, x:x+w]
    cropped_box_color = cv2.cvtColor(cropped_box, cv2.COLOR_GRAY2BGR)

    # Теперь ищем все черные контуры (предположительно маркировку)
    _, black_threshold = cv2.threshold(cropped_box, 127, 255, cv2.THRESH_BINARY_INV)
    black_contours, _ = cv2.findContours(black_threshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in black_contours:
        bx, by, bw, bh = cv2.boundingRect(contour)
        cv2.rectangle(cropped_box_color, (bx, by), (bx+bw, by+bh), (0, 0, 255), 2)

    bbs = []
    centroids = []
    j = 0
    for contour in black_contours:
        bx, by, bw, bh = cv2.boundingRect(contour)
        centroid = [bx + bw / 2, by + bh / 2]
        cv2.circle(cropped_box_color, [int(x) for x in centroid], 10, (0, 255, 0), 2)
        cv2.putText(cropped_box_color, str(j), [int(x) for x in centroid], cv2.FONT_HERSHEY_DUPLEX, 2, (255,255,0), 2, cv2.LINE_AA)
        bbs.append([bx, by, bw, bh])
        centroids.append([int(x) for x in centroid])
        j += 1
        result_img = crop_img(image, bx, by, bw, bh, 32, 32)
        detections.append(result_img)
    bx, by, bw, bh = cv2.boundingRect(black_contours[0])
    cv2.rectangle(cropped_box_color, (bx, by), (bx+bw, by+bh), (255, 0, 0), 2)

    centroid_scores_x = []
    centroid_scores_y = []
    centroid_scores = []

    j = -1

    for i in range(len(bbs) - 1):
        centroid_scores_x.append((centroids[i][0] - centroids[j][0]) / bbs[j][2])
        centroid_scores_y.append((centroids[i][1] - centroids[j][1]) / bbs[j][3])
        centroid_scores.append([(centroids[i][0] - centroids[j][0]) / bbs[j][2], (centroids[i][1] - centroids[j][1]) / bbs[j][3]])

    image_color[y:y+h, x:x+w] = cropped_box_color
    return image_color, centroid_scores, detections

def compare_images(img1, img2):
    """
    Попиксельно сравнивает два черно-белых изображения
    
    Parameters:
        img1: Структура первого из CV2 для первого изображения (grayscale)
        img2: Структура первого из CV2 для первого изображения (grayscale)
        
    Returns:
        similarity_score: Оценка схожести изображения представленная от 0 до 1.
    """
    if img1.shape != img2.shape:
        raise ValueError("The dimensions of the images must be the same.")
        
    total_pixels = img1.shape[0] * img1.shape[1]
    diff = np.abs(img1 - img2)
    total_diff = np.sum(diff)
    max_diff = total_pixels * 255
    similarity_score = 1 - (total_diff / max_diff)
    
    return similarity_score

def euclidean_distance(v1, v2):
    """
    Рассчитывает евклидово расстояние между двумя векторами.
    
    Parameters:
        v1: Первый вектор
        v2: Второй вектор
        
    Returns:
        dist: Вещественное число - расстояние между векторами v1 и v2.
    """
    return ((v1[0] - v2[0])**2 + (v1[1] - v2[1])**2)**0.5

def create_cost_matrix(input_list, reference_list):
    if len(input_list) == 0:
        return np.array([])
    """
    Строит матрицу стоимостей для Венгерского алгоритма.
    
    Parameters:
        input_list: список со всеми векторами образца
        reference_list: эталонный список векторов
        
    Returns:
        matrix: Numpy матрица стоимостей.
    """
    return np.array([[euclidean_distance(in_vec, ref_vec) for in_vec in input_list] for ref_vec in reference_list])

# TODO: переделать Венгерский алгоритм таким образом, чтобы учитывался не просто модуль, а именно сами вектора (то есть и их направление тоже)
def find_closest_vectors(input_list, reference_list, start_i):
    """
    Находит подмножество наиболее близких векторов из представленных на образце к тем векторам, что представлены в эталонном списке, используя Венгерский алгоритм.
    
    Parameters:
        input_list: список со всеми векторами образца
        reference_list: эталонный список векторов
        start_i: индекс детекции, выбранный в качестве базового
        
    Returns:
        result: Список векторов наиболее подходящих по расстоянию к эталону.
        indices: Список индексов детекций, соответствующих выбранным векторам.
    """
    cost_matrix = create_cost_matrix(input_list, reference_list)
    
    ref_indices, input_indices = linear_sum_assignment(cost_matrix)
    
    result = [input_list[idx] for idx in input_indices]
    return result, input_indices.tolist() + [start_i]

def get_sample_score(image, centroid_scores):
    """
    Находит наиболее близкий детекций маркировки логотипа на образце тому, что был представлен на эталоне. 
    Паттерн формализуется в виде списка векторов расстояний от произвольного элемента логотипа до всех остальных.
    
    Parameters:
        image: исходное изображения.
    
    Returns:
        image_color: изображение с разметкой (чисто для debug)
        new_detections: список нормализованных изображений отдельных элементов распознанного логотипа
        quad: список вершин четырехугольника, охватывающего всю маркировку логотипа.
    """
    new_detections = []

    image_color = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    largest_contour = contours[0]
    x, y, w, h = cv2.boundingRect(largest_contour)

    cropped_box = image[y:y+h, x:x+w]

    cropped_box_color = cv2.cvtColor(cropped_box, cv2.COLOR_GRAY2BGR)
    cropped_box_color_copy = np.copy(cropped_box_color)

    _, black_threshold = cv2.threshold(cropped_box, 127, 255, cv2.THRESH_BINARY_INV)
    black_contours, _ = cv2.findContours(black_threshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in black_contours:
        bx, by, bw, bh = cv2.boundingRect(contour)

    bbs = []
    centroids = []
    for contour in black_contours:
        bx, by, bw, bh = cv2.boundingRect(contour)
        ih, iw = image.shape
        if bw/iw < 0.01 or bh/ih < 0.01 or bw/bh > 5 or bh/bw > 5:
            continue
        cv2.rectangle(cropped_box_color, (bx, by), (bx+bw, by+bh), (0, 0, 255), 2)
        centroid = [bx + bw / 2, by + bh / 2]
        cv2.circle(cropped_box_color, [int(x) for x in centroid], 10, (0, 255, 0), 2)
        bbs.append([bx, by, bw, bh])
        centroids.append([int(x) for x in centroid])

    if len(black_contours) == 0:
        return image_color, [], None
        
    bx, by, bw, bh = cv2.boundingRect(black_contours[-1])

    nearest_scores = []

    for i in range(len(bbs)):
        centroid_scores_i = []
        for j in range(len(bbs)):
            centroid_scores_i.append([(centroids[j][0] - centroids[i][0]) / bbs[i][2], (centroids[j][1] - centroids[i][1]) / bbs[i][3]])
        nearest_scores_i, indexes_i = find_closest_vectors(centroid_scores_i, centroid_scores, i)
        nearest_scores.append([nearest_scores_i, indexes_i])

    min_euclid_distance_score = 0
    result_index = 0
    for j in range(len(nearest_scores[0][0])):
        min_euclid_distance_score += euclidean_distance(nearest_scores[i][0][j], centroid_scores[j])

    for i in range(1, len(nearest_scores)):
        current_euclid_distance_score = 0
        for j in range(len(nearest_scores[i][0])):
            current_euclid_distance_score += euclidean_distance(nearest_scores[i][0][j], centroid_scores[j])
        if current_euclid_distance_score < min_euclid_distance_score:
            min_euclid_distance_score = current_euclid_distance_score
            result_index = i

    bx, by, bw, bh = bbs[nearest_scores[result_index][1][0]][0], bbs[nearest_scores[result_index][1][0]][1], bbs[nearest_scores[result_index][1][0]][2], bbs[nearest_scores[result_index][1][0]][3]
    min_x, min_y, max_x, max_y = bx, by, bx, by
    for j in range(len(nearest_scores[result_index][1])):
        bx, by, bw, bh = bbs[nearest_scores[result_index][1][j]][0], bbs[nearest_scores[result_index][1][j]][1], bbs[nearest_scores[result_index][1][j]][2], bbs[nearest_scores[result_index][1][j]][3]
        cv2.rectangle(cropped_box_color, (bx, by), (bx+bw, by+bh), (255, 0, 0), 2)
        cv2.circle(cropped_box_color, [int(x) for x in centroids[nearest_scores[result_index][1][j]]], 15, (255, 0, 0), 2)
        cv2.putText(cropped_box_color, str(j), [int(x) for x in centroids[nearest_scores[result_index][1][j]]], cv2.FONT_HERSHEY_DUPLEX, 0.9, (255,255,0), 1, cv2.LINE_AA)
        result_img = crop_img(cropped_box_color_copy, bx, by, bw, bh, 32, 32)
        new_detections.append(result_img)
        min_x = min(bx, min_x)
        max_x = max(bx + bw, max_x)
        min_y = min(by, min_y)
        max_y = max(by + bh, max_y)
    
    image_color[y:y+h, x:x+w] = cropped_box_color
    return image_color, new_detections, [[min_x, min_y], [max_x, min_y], [max_x, max_y], [min_x, max_y]]

def detect_logo_zone(ground_truth_path: str, sample_path: str):
    """
    Обнаруживает ограничивающую рамку (bounding box) предполагаемой маркировки логотипа и оценивает схожесть этой маркировки с представленной на эталоне в виде нормализованного числа от 0 до 1.
    Возвращаемая ограничивающая рамка необходима для валидацией пользователем той предполагаемой области изображения, в которой содержится маркировка, на предмет ее фактического нахождения.
    
    Параметры:
        sample_path: строка, содержащая путь к изображению с образцом.
        ground_truth_path: строка, содержащая путь к изображению с эталоном
    
    Возвращаемое значение:
        quad: четырехугольник в виде списка четырех точек - ограничивающая рамка распознанного логотипа. Равен None в случае отсутствия возможности распознать логотип на изображении.
        score: схожесть маркировок логотипов (образца и эталона), выраженная числом на отрезке от 0 до 1.
    """

    # Сначала находим логотип/маркировку на эталоне и запоминаем паттерн этого логотипа
    binarized = get_binarized_image(ground_truth_path)
    output, centroid_scores, detections = get_ground_truth_score(binarized)

    # Затем ищем наиболее похожий паттерн на образце
    binarized = get_binarized_image(sample_path)
    output, new_detections, logo_quad = get_sample_score(binarized, centroid_scores)

    # Теперь проверим схожесть образца с эталоном
    score = 0.0
    i = 0
    for detection, ground_truth in zip(new_detections, detections):
        score += compare_images(detection, ground_truth)
        i += 1   

    score /= len(detections) - 1     

    # cv2.imshow("Barcode Detection", output)
    # cv2.waitKey(0)

    return logo_quad, score
    
if __name__ == '__main__':
    quad, score = detect_logo_zone(sys.argv[1], sys.argv[2])
    print(f'quad = {quad}; score = {score}')
