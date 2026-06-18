from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from conftest import BASE_URL


def test_pagina_login_carrega(driver):
    driver.get(f'{BASE_URL}/login')
    assert driver.find_element(By.CSS_SELECTOR, 'input[type="email"]').is_displayed()


def test_campos_login_presentes(driver):
    driver.get(f'{BASE_URL}/login')
    assert driver.find_element(By.CSS_SELECTOR, 'input[type="email"]').is_displayed()
    assert driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').is_displayed()
    assert driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').is_displayed()


def test_mensagem_boas_vindas(driver):
    driver.get(f'{BASE_URL}/login')
    body = driver.find_element(By.TAG_NAME, 'body').text
    assert 'bem-vinda' in body.lower() or 'entrar' in body.lower()


def test_erro_credencial_invalida(driver):
    driver.get(f'{BASE_URL}/login')

    driver.find_element(By.CSS_SELECTOR, 'input[type="email"]').send_keys('invalido@email.com')
    driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys('senhaerrada')
    driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'form p')))

    erro = driver.find_element(By.CSS_SELECTOR, 'form p')
    assert erro.is_displayed()


def test_link_recuperar_senha(driver):
    driver.get(f'{BASE_URL}/login')
    link = driver.find_element(By.PARTIAL_LINK_TEXT, 'Esqueceu')
    assert link.is_displayed()
