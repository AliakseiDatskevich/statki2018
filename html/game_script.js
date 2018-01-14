function Position(x, y) {
    this.x = x;
    this.y = y;
    this.getX = function getX() {
        return this.x
    };
    this.getY = function getY() {
        return this.x
    };
};


function Ship(positionArray, lenght) {
    this.positionArray = positionArray;
    this.length = lenght;
    this.canCreateMast = function () {
        return positionArray.length < lenght;
    }
}

function positionArraycontains(positionArray, x, y) {
    var i = positionArray.length;
    while (i--) {
        if (positionArray[i].x == x && positionArray[i].y == y) {
            return true;
        }
    }
    return false;
}

/**
 * Removes position from array only if its the first or the last one.
 * @param positionArray
 * @param x
 * @param y
 */
function removePositionFromArray(positionArray, x, y) {
    var lastElement = positionArray.length - 1;
    if (positionArray[0].x == x && positionArray[0].y == y) {
        positionArray.splice(0, 1);
        positionArray.sort(sortPositionArray);
        return true;
    } else if (positionArray[lastElement].x == x && positionArray[lastElement].y == y) {
        positionArray.splice(lastElement, 1);
        positionArray.sort(sortPositionArray);
        return true;
    }
    return false;
}

var ship = null;
var shipArray = [];
var currentShip = 0;
var ID_SHIP_4_MAST = {id: 0, length: 4, name: "Czteromasztowiec"};
var ID_SHIP_3_MAST_1 = {id: 1, length: 3, name: "Trojmasztowiec"};
var ID_SHIP_3_MAST_2 = {id: 2, length: 3, name: "Trojmasztowiec"};
var ID_SHIP_2_MAST_1 = {id: 3, length: 2, name: "Dwumasztowiec"};
var ID_SHIP_2_MAST_2 = {id: 4, length: 2, name: "Dwumasztowiec"};
var ID_SHIP_2_MAST_3 = {id: 5, length: 2, name: "Dwumasztowiec"};
var ID_SHIP_1_MAST_1 = {id: 6, length: 1, name: "Jednomasztowiec"};
var ID_SHIP_1_MAST_2 = {id: 7, length: 1, name: "Jednomasztowiec"};
var ID_SHIP_1_MAST_3 = {id: 8, length: 1, name: "Jednomasztowiec"};
var ID_SHIP_1_MAST_4 = {id: 9, length: 1, name: "Jednomasztowiec"};
var availableShips = [ID_SHIP_4_MAST, ID_SHIP_3_MAST_1, ID_SHIP_3_MAST_2, ID_SHIP_2_MAST_1, ID_SHIP_2_MAST_2,
    ID_SHIP_2_MAST_3, ID_SHIP_1_MAST_1, ID_SHIP_1_MAST_2, ID_SHIP_1_MAST_3, ID_SHIP_1_MAST_4];

var createBoard = function () {
    posX = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    posY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    var tileLength = 100 / (posX.length + 1);

    for (var i = -1; i < posX.length; i++) {
        for (var j = -1; j < posY.length; j++) {
            if (i == -1 && j == -1) {
                // empty tile
                $("#board").append('<div class="tile positionTile"></div>');
                $("#opponentBoard").append('<div class="tile positionTile"></div>');
                continue;
            }

            if (j == -1) {
                // Add pos Y tile
                $("#board").append('<div class="tile positionTile">' + posY[i] + '</div>');
                $("#opponentBoard").append('<div class="tile positionTile">' + posY[i] + '</div>');
                continue;
            }
            if (i == -1) {
                // Add pos X tile
                $("#board").append('<div class="tile positionTile">' + posX[j] + '</div>');
                $("#opponentBoard").append('<div class="tile positionTile">' + posX[j] + '</div>');
                continue;
            }
            $('<div class="tile playerTile smoothfade"> </div>').appendTo($("#board")).attr("data-posx", posX[j]).attr("data-posy", posY[i]).addClass("white");
            $('<div class="tile opponentTile smoothfade"> </div>').appendTo($("#opponentBoard")).attr("data-posx", posX[j]).attr("data-posy", posY[i]).addClass("white");
        }
    }

    $(".tile").css("width", tileLength + '%');
    $(".tile").css("height", tileLength + '%');
}

function shot() {
    var shotPosition = $("#shotTilePositionInput").val();
    $("#shotTilePositionInput").val("");
    $("#opponentBoard").find("[data-posx='" + shotPosition.substring(0, 1) + "'][data-posy='" + shotPosition.substring(1) + "']").text("X");
}

function shipCreationBtnClick() {
    if (ship == null) {
        alert("Nie utworzyles statku!");
    } else {
        if (ship.canCreateMast()) {
            alert("Brakuje: " + (ship.length - ship.positionArray.length) + " masztu(ow)!")
        } else {
            // Accepting ship
            shipArray.push(ship);
            ship = null;
            currentShip++;
            if (currentShip == availableShips.length) {
                // No more ships to set, start the game
                $("#currentAction").text("Oczekiwanie na drugiego gracza...");
                $("#shipCreationBtn").css("display", "none");
                setTimeout(function () {
                    $("#overlay").remove();
                    $("#currentAction").text("Wybierz pole do ataku:");
                    $("#shotTilePositionInput").css("display", "flex");
                    $("#shotBtn").css("display", "flex");
                }, 2000);
            } else {
                $("#currentAction").text("Ustaw: " + availableShips[currentShip].name);
            }
            $("#shipCreationBtn").removeClass("btn");
            $("#shipCreationBtn").addClass("btnDisabled");
        }
    }
}

function sortPositionArray(a, b) {
    if (a.x == b.x) {
        return a.y - b.y;
    } else if (a.y == b.y) {
        return a.x.charCodeAt(0) - b.x.charCodeAt(0);
    }
    return -1;
}

function canCreateShipInTile(tile) {
    var x = tile.data("posx");
    var y = tile.data("posy");

    for (var i = 0; i < shipArray.length; i++) {

        var j = shipArray[i].positionArray.length;
        while (j--) {
            if (shipArray[i].positionArray[j].x == x && shipArray[i].positionArray[j].y == y) {
                return false;
            } else if (Math.abs(shipArray[i].positionArray[j].x.charCodeAt(0) - x.charCodeAt(0)) < 2 && Math.abs(shipArray[i].positionArray[j].y - y) < 2) {
                return false;
            }
        }
    }
    return true;
}

$(document).ready(function ($) {
    createBoard();

    $("#currentAction").text("Ustaw: " + availableShips[currentShip].name);
    $("#shotTilePositionInput").css("display", "none");
    $("#shotBtn").css("display", "none");
    var tiles = $(".playerTile");

    tiles.on('mouseenter', function () {
        var currentTile = $(this);
        var posX = currentTile.data("posx");
        var posY = currentTile.data("posy");

        if (currentShip == availableShips.length) {
            return;
        }

        if (ship != null) {
            // Ship exists, validate hover only if has more than 1 position
            var positionArray = ship.positionArray;

            if (positionArraycontains(positionArray, posX, posY)) {
                return;
            }

            if (!ship.canCreateMast() || !canCreateShipInTile(currentTile)) {
                $(this).addClass('hoverRed');
                return;
            }

            if (positionArray.length > 1) {
                if (positionArray[0].x == positionArray[1].x) {
                    // Validating horizontally
                    if (posX == positionArray[0].x && (posY - positionArray[0].y == -1 || posY - positionArray[positionArray.length - 1].y == 1)) {
                        $(this).addClass('hover');
                    } else {
                        $(this).addClass('hoverRed');
                    }
                } else if (positionArray[0].y == positionArray[1].y) {
                    // Validating vertically
                    if (posY == positionArray[0].y && (posX.charCodeAt(0) - positionArray[0].x.charCodeAt(0) == -1
                            || posX.charCodeAt(0) - positionArray[positionArray.length - 1].x.charCodeAt(0) == 1)) {
                        $(this).addClass('hover');
                    } else {
                        $(this).addClass('hoverRed');
                    }

                }
            } else if (positionArray.length == 1) {
                var diffX = Math.abs(posX.charCodeAt(0) - positionArray[0].x.charCodeAt(0));
                var diffY = Math.abs(posY - positionArray[0].y);
                if (diffX == 1 && diffY == 0) {
                    // Moving horizontally
                    $(this).addClass('hover');
                } else if (diffY == 1 && diffX == 0) {
                    // Moving vertically
                    $(this).addClass('hover');
                } else {
                    $(this).addClass('hoverRed');
                }
            } else {
                $(this).addClass('hover');
            }
        } else {
            if (currentTile.hasClass("green")) {
                // Another ship already created
                $(this).addClass('hoverRed');
            } else if (!canCreateShipInTile($(this))) {
                $(this).addClass('hoverRed');
            } else {
                $(this).addClass('hover');
            }

        }
    });

    tiles.on('mouseleave', function () {
        $(this).removeClass('hover');
        $(this).removeClass('hoverRed');
    });

    tiles.on('click', function () {
        var currentTile = $(this);
        var posX = currentTile.data("posx");
        var posY = currentTile.data("posy");

        if (!currentTile.hasClass('hoverRed') && ship === null) {
            var positionArray = [new Position(posX, posY)];
            ship = new Ship(positionArray, availableShips[currentShip].length);
            currentTile.addClass('green');
        } else {
            if (!currentTile.hasClass('hoverRed') && ship.canCreateMast()
                && !positionArraycontains(ship.positionArray, posX, posY)) {
                // Valid, add position
                ship.positionArray.push(new Position(posX, posY));
                ship.positionArray.sort(sortPositionArray);
                currentTile.addClass('green');
            } else if (currentTile.hasClass('green') && positionArraycontains(ship.positionArray, posX, posY)) {
                // Remove selected ship tile
                var success = removePositionFromArray(ship.positionArray, posX, posY);
                if (success) {
                    currentTile.removeClass('green');
                }
            }
        }
        if (ship != null && ship.canCreateMast()) {
            $("#shipCreationBtn").removeClass("btn");
            $("#shipCreationBtn").addClass("btnDisabled");
        } else if (ship != null) {
            $("#shipCreationBtn").addClass("btn");
            $("#shipCreationBtn").removeClass("btnDisabled");
        }
        console.log("Last Clicked Tile : " + posX + "," + posY);

    });
});

