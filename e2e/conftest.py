import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

BASE_URL = os.environ.get(
    'STELLA_URL',
    'https://lively-pebble-0ccda8e0f.7.azurestaticapps.net',
)


@pytest.fixture
def driver():
    opts = Options()
    opts.add_argument('--headless')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--window-size=1280,800')
    browser = webdriver.Chrome(options=opts)
    browser.implicitly_wait(8)
    yield browser
    browser.quit()
