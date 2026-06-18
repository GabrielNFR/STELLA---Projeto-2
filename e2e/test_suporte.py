from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from conftest import BASE_URL


def test_pagina_suporte_carrega(driver):
    driver.get(f'{BASE_URL}/help')
    assert driver.find_element(By.TAG_NAME, 'body').is_displayed()


def test_opcoes_de_contato_presentes(driver):
    driver.get(f'{BASE_URL}/help')
    body = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert 'whatsapp' in body or 'ligar' in body or 'enfermagem' in body


def test_horario_atendimento_visivel(driver):
    driver.get(f'{BASE_URL}/help')
    body = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert '8h' in body or 'segunda' in body or 'horário' in body


def test_suporte_redireciona_sem_autenticacao(driver):
    driver.get(f'{BASE_URL}/help')
    WebDriverWait(driver, 8).until(
        lambda d: '/login' in d.current_url or '/help' in d.current_url
    )
    assert '/login' in driver.current_url or '/help' in driver.current_url
