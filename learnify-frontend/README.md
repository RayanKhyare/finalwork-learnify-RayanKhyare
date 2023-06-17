
# Learnify 

Learnify is een interactief
streamingplatform dat een eenvoudige
en boeiende manier biedt om online
lessen te volgen. Als iemand die zelf
heeft ervaren hoe uitdagend en soms
saai online lessen kunnen zijn, realiseerde
ik me al snel dat er een oplossing moest
zijn om studenten te laten genieten
van een online les alsof ze zich in
een klaslokaal bevinden. 

## Practical links

Link naar de website : https://learnify-frontend.vercel.app/

## Bronnen

- PedroTech. (2022b, augustus 4). ReactJS Course [9] -
    UseContext Hook | State Management [Video]. YouTube.
    https://www.youtube.com/watch?v=FzBGqvxdxv0

- PedroTech. (2022, 22 maart). Socket.io + ReactJS Tutorial | Learn Socket.io For
    Beginners [Video]. YouTube. https://www.youtube.com/watch?v=djMy4QsPWiI

- Aaron Saunders. (2022, 2 februari). Working With Remix, Prisma and
    SQLite [Video]. YouTube. https://www.youtube.com/watch?v=g2OouwUAtvE

- A lot of stackoverflow

- Framer motion : https://www.youtube.com/watch?v=SuqU904ZHA4

- How cloudinary works : https://www.youtube.com/watch?v=Y-VgaRwWS3o

- Prisma documentation : https://www.prisma.io/docs/getting-started/quickstart

- Relational databases in Prisma : https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql

## Onderhoudsdocumentatie

De website is verdeeld in 2 delen: de frontend en de backend. Om het project te kunnen
starten, moet je eerst het project van github halen en het op je computer clonen:
Voer in jouw terminal dit commando in:
```
git clone https://github.com/RayanKhyare/finalwork-learnifyRayanKhyare.git

cd .\finalwork-learnify-RayanKhyare\
```
Zodra het project is gedownload, moet je de server starten zodat
de applicatie correct kan functioneren. Voer dit in je terminal in:
```
cd ./learnify-backend/

npm install
```
Nu moet je een paar gegevens in het .env.example-file wijzigen. Begin met het
invoeren van de juiste gegevens voor TOKEN_SECRET en REFRESH_TOKEN_SECRET (je
kunt deze vinden in de bijgeleverde zipfile). Verwijder daarna de toevoeging ‘.example’
uit de bestandsnaam, zodat het gewoon ‘.env’ wordt. Daarna kun je de server starten
met het volgende commando:
```
npm start
```
Na het starten van de server moet je de frontend starten om door de site
te kunnen browsen. Voer dit commando in je terminal in (ik raad u aan om
een tweede terminal te openen zodat de server tegelijkertijd kan draaien):
```
cd ./learnify-frontend/

npm install
```
Voor de frontend moet je hetzelfde doen als voor de
backend. Ga naar het bestand ‘./src/components/
services/apiKey.example.js’ en voer je
Google API-key in. Verwijder vervolgens opnieuw de
toevoeging ‘.example’ uit de bestandsnaam, zodat
het bestand gewoon ‘apiKey.js’ wordt. Daarna kun
je de frontend starten met het volgende commando:
```
npm run dev
```
Eens dat dit gedaan is , kunt u in de terminal de
juiste url vinden om op de website te gaan.

## Gebruikersdocumentatie

Als je voor het eerst op de site komt, zie je een
popup die je wat meer informatie geeft over de
website. Als je alles gelezen hebt, kun je vrij over
de site navigeren met de navigatie bovenaan het
scherm of onderaan in het midden. Gebruikers
zullen alle streams, video's en categorieën
kunnen vinden. Ze hebben elk een pagina
waarop je meer informatie terug kan vinden. De
categorieen zijn bestaande opleidingen in België.

Om een stream te kunnen starten, moet je
natuurlijk een account hebben om mogelijke
spam te vermijden. Je kunt een account
aanmaken of inloggen rechtsboven in het scherm
met de 2 knoppen die hiervoor zijn gemaakt.
Het is belangrijk om als docent een account
aan te maken om te kunnen beginnen met
streamen. Daarom is het belangrijk om voor
de rol ‘Docent’ te kiezen bij het inscrijven.

Zodra je een account hebt aangemaakt en bent
ingelogd, verschijnen er 2 nieuwe icoontjes
rechtsboven in het scherm: de ene om een
video te publiceren en de andere om een stream
te starten. De 2 formulieren lijken erg op elkaar.
Je hoeft alleen maar een YouTube-link naar een
livestream of video in te voeren en gegevens
zoals de videotitel en -beschrijving worden
automatisch geïmporteerd. Dit bespaart de
gebruiker veel tijd. Je hoeft alleen maar de
categorie te kiezen en optioneel bestanden
toe te voegen als de streamer dat wil. 

Wanneer een live sessie is aangemaakt,
wordt de gebruiker doorgestuurd naar
een pagina die het dashboard van de
leraar is, waar hij of zij de live sessie kan
controleren als hij of zij dat wil. De controle
over de live sessie gebeurt onderaan het
scherm in de navigatie waar er icoontjes
zijn om een poll, een vraag en antwoord
of een knop om de live sessie te stoppen.
De poll en Q&A opties openen een
popup die vrij eenvoudig te begrijpen is.

Studenten kunnen direct op hun scherm
reageren op de verschillende polls en vragen
en antwoorden terwijl ze op de livestream
verschijnen, om te laten zien hoe belangrijk
ze de cursus vinden. Rechts van het scherm
is de chat waar de gebruiker kan praten met
anderen die aanwezig zijn op de stream.

Zodra een stream wordt gestopt, wordt
er automatisch een video gemaakt die
automatisch wordt toegevoegd aan de
video's in de categorie die de gebruiker heeft
gekozen voordat hij de livestream startte.

In de rechterbovenhoek vind je ook een
profielfoto. Door erop te klikken, kun je ervoor
kiezen om naar de profielpagina te gaan of
uit te loggen. Op de profielpagina kun je je
gegevens wijzigen, je video’s en streams
vinden en tot slot je account verwijderen.