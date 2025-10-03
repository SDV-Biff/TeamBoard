*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://localhost:8080/
${BROWSER}    chrome
${USERNAME}    admin
${PASSWORD}    admin123

*** Test Cases ***
Test d'exemple
    [Tags]    connexion
    Open Browser     ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible     xpath=//input[@id='username']    5s
    Input Text     xpath=//input[@id='username']    ${USERNAME}
    Input Text     xpath=//input[@id='password']    ${PASSWORD}
    Click Element     xpath=//button[@type='submit']
    Wait Until Element Is Visible     xpath=//*[contains(text(),'Se déconnecter')]    5s
    Sleep    2s
    Click Element     xpath=//*[contains(text(),'Se déconnecter')]
    Wait Until Element Is Visible     xpath=//input[@id='username']    5s
    Sleep    2s
    Close Browser
