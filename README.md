Die Savr-API ist unter Port 4000 erreichbar, und benötigt auf allen Endpoints(bis auf Login und Register) einen access_token in Form eines JWT-Tokens und einen Refresh-Tokens im folgenden Format:

---

# Installation Guide

Um das Savr-backend zu starten, sind folgende Schritte zu befolgen:

1. **Node.js installieren:** Stelle sicher, dass eine aktuelle Version von Node.js auf dem System installiert ist. Getestet wurde das Projekt mit Version 23.11.
    
2. **.env Datei hinzufügen:** Lege deine `.env`-Datei in das Projektverzeichnis von `savr-backend`. Diese Datei enthält wichtige Umgebungsvariablen für die Anwendung.

3. **Backend starten:** Navigiere im Terminal zum `savr-backend`-Verzeichnis und führe den folgenden Befehl aus:
    ```
    node index.js
    ```

---


# Authentifizierung
cd 
Die Api benötigt auf allen Endpoints(bis auf Login und Register) einen access_token in Form eines JWT-Tokens und einen Refresh-Tokens im folgenden Format:
#### Header

| Name            | Inhalt                |
| --------------- | --------------------- |
| authorization   | Bearer {access_token} |
| x-refresh-token | {refresh_tokenx}      |


**Bei falsch gesetzten Tokens bekommt man bei sämtlichen Endpoints folgendes zurück:**

{
  "error": "Invalid token",
  "detailed": {
    "isAuthError": true,
    "name": "AuthApiError",
    "status": 400,
    "code": "refresh_token_not_found"
  }
}


# login

* **URL:** `http://localhost:4000/login
* **Methode**: `POST`

#### Request

| Name     | Datentyp | Beschreibung           |
| -------- | -------- | ---------------------- |
| email    | String   | E-Mail des Benutzers   |
| password | String   | Passwort des Benutzers |
**Beispiel:** 
{
  "email": "jandl.maximilian11@gmail.com",
  "password": "securepassword"
}
#### Response

| Name    | Datentyp | Beschreibung                                                     |
| ------- | -------- | ---------------------------------------------------------------- |
| user    | object   | Object mit den vollständigen Profildetails des Benutzers         |
| session | object   | Object mit den Details der Session (access_token, refresh_token) |
**Beispiel:** 
{
  "user": {
    "id": "95609032-b3c7-4ba5-a45c-6763eae207f1",
    "aud": "authenticated",
    "role": "authenticated",
    ...
  },
  "session": {
    "access_token": "XYZ",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1750878267,
    "refresh_token": "XYZ"
    ...
  }
}


# Register

* **URL:** `http://localhost:4000/register
* **Methode**: `POST`

#### Request

| Name     | Datentyp | Beschreibung           |
| -------- | -------- | ---------------------- |
| email    | String   | E-Mail des Benutzers   |
| password | String   | Passwort des Benutzers |
**Beispiel:** 
{
  "email": "jandl.maximilian11@gmail.com",
  "password": "securepassword"
}
#### Response

| Name    | Datentyp | Beschreibung                                                     |
| ------- | -------- | ---------------------------------------------------------------- |
| user    | object   | Object mit den vollständigen Profildetails des Benutzers         |
| session | object   | Object mit den Details der Session (access_token, refresh_token) |
**Beispiel:** 
{
  "user": {
    "id": "95609032-b3c7-4ba5-a45c-6763eae207f1",
    "aud": "authenticated",
    "role": "authenticated",
    ...
  },
  "session": {
    "access_token": "XYZ",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1750878267,
    "refresh_token": "XYZ"
    ...
  }
}



# availableMonths

* **URL:** `http://localhost:4000/availableMonths
* **Methode**: `POST`
* **Beschreibung**: liefert die Monate zurück, in denen der Benutzer Transaktionen getätigt hat.
#### Request

| Name    | Datentyp | Beschreibung                     |
| ------- | -------- | -------------------------------- |
| user_id | UUID     | Eindeutige Kennung des Benutzers |
**Beispiel:** 

{
  "user_id" : "95609032-b3c7-4ba5-a45c-6763eae207f1"
}

#### Response

Die Response ist ein Array bestehend aus Objekten in folgendem Format:

| Name             | Datentyp | Beschreibung                       |
| ---------------- | -------- | ---------------------------------- |
| transaction_date | String   | Jahr und Datum im Format (YYYY-MM) |
**Beispiel:** 
[
  {
    "transaction_date": "2025-05"
  },
  {
    "transaction_date": "2025-06"
  }
]



# balance

* **URL:** `http://localhost:4000/balance
* **Methode**: `POST`
* **Beschreibung**: liefert den derzeitigen Kontostand zurück
#### Request

| Name    | Datentyp | Beschreibung                     |
| ------- | -------- | -------------------------------- |
| user_id | UUID     | Eindeutige Kennung des Benutzers |
**Beispiel:** 

{
  "user_id" : "95609032-b3c7-4ba5-a45c-6763eae207f1"
}

#### Response

| Name    | Datentyp | Beschreibung         |
| ------- | -------- | -------------------- |
| balance | Integer  | Aktueller Kontostand |
**Beispiel:** 

-570


# expenses

* **URL:** `http://localhost:4000/expenses
* **Methode**: `POST`
* **Beschreibung**: liefert die monatlichen Ausgaben für eine bestimmte Kategorie für Monats zurück 
#### Request

| Name          | Datentyp | Beschreibung                     |
| ------------- | -------- | -------------------------------- |
| user_id       | UUID     | Eindeutige Kennung des Benutzers |
| category_name | String   | Name einer Kategorie             |
**Beispiel:** 

{
  "user_id": "95609032-b3c7-4ba5-a45c-6763eae207f1",
  "category_name": "Kleidung"
}

#### Response

Die Response ist ein Array bestehend aus Objekten in folgendem Format:

| Name             | Datentyp | Beschreibung                                               |
| ---------------- | -------- | ---------------------------------------------------------- |
| sum              | Integer  | die monatlichen Ausgaben in der gegebenen Kategorie        |
| transaction_date | String   | Jahr und Monat, in denen die Transaktionen getätigt wurden |
**Beispiel:** 
[
  {
    "sum": 54,
    "transaction_date": "2025-05"
  },
  {
    "sum": 54,
    "transaction_date": "2025-06"
  }
]


# getMonthlyLimit

* **URL:** `http://localhost:4000/getMonthlyLimit
* **Methode**: `POST`
* **Beschreibung**: liefert die monatlichen Ausgaben für eine bestimmte Kategorie für Monats zurück 
#### Request

| Name          | Datentyp | Beschreibung                     |
| ------------- | -------- | -------------------------------- |
| user_id       | UUID     | Eindeutige Kennung des Benutzers |
| category_name | String   | Name der Kategorie               |
**Beispiel:** 

{
  "user_id" : "95609032-b3c7-4ba5-a45c-6763eae207f1",
  "category_name" : "Gesundheit"
}

#### Response

| Name    | Datentyp | Beschreibung                           |
| ------- | -------- | -------------------------------------- |
| maximum | Integer  | Das Maximum für die gegebene Kategorie |
**Beispiel:** 
[
  {
    "maximum": 210
  }
]


# logout

* **URL:** `http://localhost:4000/getMonthlyLimit
* **Methode**: `POST`
* **Beschreibung**: loggt den User aus und setzt die Session in Supabase zurück
#### Request

leerer Body

#### Response

"Success"


# monthly_limit

* **URL:** `http://localhost:4000/monthly_limit
* **Methode**: `POST`
* **Beschreibung**: Setzt ein monatliches Limit für einen Nutzer
#### Request

| Name          | Datentyp | Beschreibung                     |
| ------------- | -------- | -------------------------------- |
| user_id       | UUID     | Eindeutige Kennung des Benutzers |
| category_name | String   | Name der Kategorie               |
| maximum       | Integer  | Das zu setzende Limit            |
**Beispiel:** 

{
  "user_id": "95609032-b3c7-4ba5-a45c-6763eae207f1",
  "category_name": "Gesundheit",
  "maximum": 210
}

#### Response

"Success"


# monthlyReport

* **URL:** `http://localhost:4000/monthlyReport
* **Methode**: `POST`
* **Beschreibung**: liefert für jeden Monat eine Summe aller Ausgaben und Eingaben, sowie die Kategorie
#### Request

| Name        | Datentyp | Beschreibung                       |
| ----------- | -------- | ---------------------------------- |
| user_id     | UUID     | Eindeutige Kennung des Benutzers   |
**Beispiel:** 

{
  "user_id" : "95609032-b3c7-4ba5-a45c-6763eae207f1"
}

#### Response

Die Response ist ein Array bestehend aus Objekten in folgendem Format:

| Name             | Datentyp | Beschreibung                                             |
| ---------------- | -------- | -------------------------------------------------------- |
| sum              | Integer  | Die Summe für das Monat                                  |
| type             | String   | Gibt an, ob es sich um eine Eingabe oder Ausgabe handelt |
| transaction_date | String   | Jahr und Datum im Format (YYYY-MM)                       |
| category_name    | String   | Name der Kategorie                                       |
**Beispiel:** 
[
  {
    "sum": 54,
    "type": "expense",
    "transaction_date": "2025-05",
    "category_name": "Freizeit"
  },
  {
    "sum": 54,
    "type": "expense",
    "transaction_date": "2025-05",
    "category_name": "Kleidung"
  },
  {
    "sum": 54,
    "type": "expense",
    "transaction_date": "2025-06",
    "category_name": "Kleidung"
  },
  {
    "sum": 162,
    "type": "expense",
    "transaction_date": "2025-06",
    "category_name": "Sonstiges"
  }
]

# monthlySpendings

* **URL:** `http://localhost:4000/monthlySpendings
* **Methode**: `POST`
* **Beschreibung**: liefert die Ausgaben für die gegebene Kategorie im aktuellen Monat
#### Request

| Name          | Datentyp | Beschreibung                     |
| ------------- | -------- | -------------------------------- |
| user_id       | UUID     | Eindeutige Kennung des Benutzers |
| category_name | String   | Name der Kategorie               |
**Beispiel:** 

{
  "user_id" : "95609032-b3c7-4ba5-a45c-6763eae207f1",
  "category_name" : "Sonstiges"
}

#### Response

Die Response entspricht der Summe des derzeitigen Monats.

**Beispiel:** 
162


# table

* **URL:** `http://localhost:4000/table
* **Methode**: `POST`
* **Beschreibung**: liefert die Tabelle aus der Datenbank, optional nach Spalten gefiltert.
#### Request

| Name                       | Datentyp          | Beschreibung                       |
| -------------------------- | ----------------- | ---------------------------------- |
| tableName                  | String            | Namen der Tabelle in der Datenbank |
| (optional) selectedColumns | Array aus Strings | Namen der Spalten                  |
**Beispiel:** 

{
  "tableName": "transaction",
  "selectedColumns" : ["category_id", "amount"]
}

#### Response

Die Response ist natürlich sehr variabel, hier ein Beispiel für die oben genannte Anfrage.


[
  {
    "category_id": "525223b5-4e9b-47dd-8443-b2eb87c8974c",
    "amount": 54
  },
  {
    "category_id": "525223b5-4e9b-47dd-8443-b2eb87c8974c",
    "amount": 54
  },
  {
    "category_id": "525223b5-4e9b-47dd-8443-b2eb87c8974c",
    "amount": 54
  },
  {
    "category_id": "3f93ff46-5153-4a81-81f4-0e7ad9d8ff10",
    "amount": 54
  },
  {
    "category_id": "7c9f8ccb-6378-4700-9a2e-aab9f9c2d629",
    "amount": 54
  },
  {
    "category_id": "7c9f8ccb-6378-4700-9a2e-aab9f9c2d629",
    "amount": 54
  }
]





# transactions

* **URL:** `http://localhost:4000/transactions
* **Methode**: `POST`
* **Beschreibung**: Trägt eine Transaktion ein.
#### Request

| Name        | Datentyp | Beschreibung                              |
| ----------- | -------- | ----------------------------------------- |
| user_id     | UUID     | Eindeutige Kennung des Benutzers          |
| category_id | UUID     | Eindeutige Kennung der Kategorie          |
| amount      | Integer  | Betrag der Transaktion                    |
| type        | String   | Eingabe oder Ausgabe ("expense"/"income") |
| date        | String   | Datum, im Format (YYYY-MM-DD)             |
**Beispiel:** 

{
  "user_id": "95609032-b3c7-4ba5-a45c-6763eae207f1",
  "category_id": "7c9f8ccb-6378-4700-9a2e-aab9f9c2d629",
  "amount": 54,
  "type": "expense",
  "date": "2025-06-14"
}

#### Response

"Success", oder ein Error Array

**Beispiel:** 
Success


# usedCategories

* **URL:** `http://localhost:4000/usedCategories
* **Methode**: `POST`
* **Beschreibung**: Gibt ein Array der Kategorien zurück, in denen der Benutzer bereits Transaktionen getätigt hat. (liefert nur Einträge mit mindestens 2 Einträgen, da ansonsten keine Graphen erstellt werden können)
#### Request

| Name    | Datentyp | Beschreibung                              |
| ------- | -------- | ----------------------------------------- |
| user_id | UUID     | Eindeutige Kennung des Benutzers          |
| type    | String   | Eingabe oder Ausgabe ("expense"/"income") |

**Beispiel:** 

{
  "user_id" : "95609032-b3c7-4ba5-a45c-6763eae207f1",
  "type" : "expense"
}

#### Response

Die Response ist ein Array bestehend aus Objekten in folgendem Format:

| Name          | Datentyp | Beschreibung       |
| ------------- | -------- | ------------------ |
| category_name | String   | Name der Kategorie |
**Beispiel:** 
[
  {
    "category_name": "Kleidung"
  },
  {
    "category_name": "Sonstiges"
  },
  {
    "category_name": "Freizeit"
  }
]

# profile

* **URL:** `http://localhost:4000/profile
* **Methode**: `POST`
* **Beschreibung**: Liefert die Profildaten(Username, Bürgerlichername) zurück
#### Request

| Name    | Datentyp | Beschreibung                              |
| ------- | -------- | ----------------------------------------- |
| user_id | UUID     | Eindeutige Kennung des Benutzers          |


**Beispiel:** 

{
  "user_id" : "a5841e1f-e3e4-4270-910f-5c58fa6972f7"
}

#### Response


| Name      | Datentyp | Beschreibung           |
| --------- | -------- | ---------------------- |
| username  | String   | Username des Benutzers |
| full_name | String   | Bürgerlicher Name      |
**Beispiel:** 
{
  "username": "MaxMus",
  "full_name": "Max Mustermann"
}

# edit_profile

* **URL:** `http://localhost:4000/edit_profile
* **Methode**: `POST`
* **Beschreibung**: Bearbeitet die Profildaten(Username, Bürgerlichername)
#### Request

| Name      | Datentyp | Beschreibung                     |
| --------- | -------- | -------------------------------- |
| user_id   | UUID     | Eindeutige Kennung des Benutzers |
| username  | String   | gewünschter Benutzername         |
| full_name | String   | gewünschter Bürgerlicher Name    |


**Beispiel:** 

{
  "user_id": "a5841e1f-e3e4-4270-910f-5c58fa6972f7",
  "username": "Test456",
  "full_name": "Test789"
}

#### Response

"Success"
**Beispiel:** 
