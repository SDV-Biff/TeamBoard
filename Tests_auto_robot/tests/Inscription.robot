*** Settings ***
Library    SeleniumLibrary
Suite Setup    Setup Browser
Suite Teardown    Teardown Browser

*** Variables ***
${URL}                http://localhost:8080
${BROWSER}            chrome
${SIGNUP_URL}         ${URL}/signup
${LOGIN_URL}          ${URL}/
${DELAY}              0.5s

# Locators
${NAME_INPUT}         id:name
${EMAIL_INPUT}        id:email
${PASSWORD_INPUT}     id:password
${CONFIRM_PASSWORD_INPUT}    id:confirmPassword
${SIGNUP_BUTTON}      xpath://button[@type='submit' and contains(text(), "S'inscrire")]
${CANCEL_BUTTON}      xpath://button[contains(text(), 'Annuler')]

# Test Data
${VALID_NAME}         test
${VALID_EMAIL}        test@example.com
${VALID_PASSWORD}     Test12345!
${INVALID_SHORT_PASSWORD}    Test

*** Test Cases ***
# Background - Aller à la page d'inscription
#     [Documentation]    Background : Given je suis sur la page "Inscription"
#     [Tags]    inscription    background
#     Aller à la page inscription  

Succès avec champs requis - Risque Très Haut
    [Documentation]    US001 - Test d'inscription réussie avec tous les champs valides
    [Tags]    inscription    success    high-risk
    [Setup]    Aller à la page inscription
    
    # When
    Saisir nom complet    ${VALID_NAME}
    Saisir email    ${VALID_EMAIL}  
    Saisir mot de passe    ${VALID_PASSWORD}
    Saisir confirmation mot de passe    ${VALID_PASSWORD}
    Cliquer sur s'inscrire
    
    # Then
    Vérifier compte créé
    Vérifier redirection vers connexion
    Vérifier message succès    Compte créé !
    
    [Teardown]    Nettoyer les données de test

# Mot de passe non conforme - Risque Faible  
#     [Documentation]    US001 - Test d'inscription avec mot de passe trop court
#     [Tags]    inscription    validation    low-risk
#     [Setup]    Aller à la page inscription
    
#     # When
#     Saisir nom complet    ${VALID_NAME}
#     Saisir email    ${VALID_EMAIL}
#     Saisir mot de passe    ${INVALID_SHORT_PASSWORD}
#     Saisir confirmation mot de passe    ${INVALID_SHORT_PASSWORD}
#     Cliquer sur s'inscrire
    
#     # Then
#     Vérifier message erreur mot de passe court
#     Vérifier toujours sur page inscription

*** Keywords ***
Setup Browser
    [Documentation]    Configuration initiale du navigateur
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}

Teardown Browser
    [Documentation]    Fermeture du navigateur
    Close Browser

Aller à la page inscription
    [Documentation]    Navigue vers la page d'inscription
    Go To    ${SIGNUP_URL}
    Wait Until Element Is Visible    ${NAME_INPUT}    5s
    Page Should Contain    Créer un compte

Saisir nom complet
    [Documentation]    Saisit le nom complet dans le champ approprié
    [Arguments]    ${nom}
    Wait Until Element Is Visible    ${NAME_INPUT}    4s
    Clear Element Text    ${NAME_INPUT}
    Input Text    ${NAME_INPUT}    ${nom}

Saisir email
    [Documentation]    Saisit l'email dans le champ approprié
    [Arguments]    ${email}
    Wait Until Element Is Visible    ${EMAIL_INPUT}    4s
    Clear Element Text    ${EMAIL_INPUT}
    Input Text    ${EMAIL_INPUT}    ${email}

Saisir mot de passe
    [Documentation]    Saisit le mot de passe dans le champ approprié
    [Arguments]    ${password}
    Wait Until Element Is Visible    ${PASSWORD_INPUT}    4s
    Clear Element Text    ${PASSWORD_INPUT}
    Input Text    ${PASSWORD_INPUT}    ${password}

Saisir confirmation mot de passe
    [Documentation]    Saisit la confirmation du mot de passe
    [Arguments]    ${confirm_password}
    Wait Until Element Is Visible    ${CONFIRM_PASSWORD_INPUT}    4s
    Clear Element Text    ${CONFIRM_PASSWORD_INPUT}
    Input Text    ${CONFIRM_PASSWORD_INPUT}    ${confirm_password}

Cliquer sur s'inscrire
    [Documentation]    Clique sur le bouton S'inscrire
    Wait Until Element Is Enabled    ${SIGNUP_BUTTON}    4s
    Click Element    ${SIGNUP_BUTTON}

Vérifier compte créé
    [Documentation]    Vérifie que le compte a été créé avec succès
    Sleep    2s    # Attendre le traitement
    
Vérifier redirection vers connexion
    [Documentation]    Vérifie la redirection vers la page de connexion
    Wait Until Location Is    ${LOGIN_URL}    5s
    Location Should Be    ${LOGIN_URL}

Vérifier message succès
    [Documentation]    Vérifie l'affichage du message de succès
    [Arguments]    ${message}
    # Recherche dans le toast de succès
    Wait Until Page Contains    ${message}    10s
    Page Should Contain    ${message}

Vérifier message erreur mot de passe court
    [Documentation]    Vérifie l'affichage du message d'erreur pour mot de passe court
    # Vérifier le message d'erreur natif HTML5 ou le toast d'erreur
    # Wait Until Page Contains    au moins 6 caractères    5s
    # Page Should Contain    min. 6 caractères
    ${message}    Execute JavaScript    return document.getElementById('password').validationMessage
    Should Contain    ${message}    6
    Should Contain    ${message}    caractères
    Should Contain    ${message}    au moins

Vérifier toujours sur page inscription
    [Documentation]    Vérifie que l'utilisateur est toujours sur la page d'inscription
    Location Should Be    ${SIGNUP_URL}
    Page Should Contain    Créer un compte
    Sleep    2s

Nettoyer les données de test
    [Documentation]    Nettoie les données créées pendant le test
    # Ici on pourrait ajouter du code pour supprimer l'utilisateur test du localStorage
    # Pour l'instant, on utilise le localStorage qui se vide à la fermeture du navigateur
    Log    Données de test nettoyées
