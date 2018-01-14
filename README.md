Gra w statki

Wykonaj aplikację webową będącą grą w statki (dla dwóch osób)

Aplikacja ma dwóch użytkowników

Uzytkownik 1 proponuje grę.

Użytkownik 2 widzi tę propozyję i może ją przyjąć.

Użytkownik, który zaproponował grę ustawia statki. Program musi kontrolować, czy statki stoją zgodnie z zasadami.

Po ustawieniu statków rozpoczynamy grę. Drugi użytkownik próbuje zgadnąć położenie statków. Nie może jednak klikać, tylko wpisuje tekst w pole, np C7.

Użytkownik 1 otrzymuje odpowiedź i akceptuje ją. Wtedy automatycznie sprawdzane jest, czy tam był statek.

Zatopienie wsyzstkich statków kończy grę.

 

Interakcję aplikacji zrealizuj z wykorzystaniem technologii AJAX.

Aplikacja powinna być responsywna. Zaproponuj odpowiedni layout i jego zmiany w zależności od wielkości wyświetlacza

Dane dla aplikacji powinny być przechowywane w bazie MySQL

Autoryzacja na stronie - dla dwóch użytkowników (zarejestrowanych na stałe).


// TODO - main game
- Websocket support:
    * send: our board at game beggining, shot
    * receive: our / opponent shot status (missed etc.), end game (print winner)
- Autofocus on shot input (every shot)
- Enter-click on shot button
- Create jpgs: miss, hit, sink, water(background?)
- Shot input validation (do not allow shooting "AB")
- In portrait mode swap player's boards in places(?)
