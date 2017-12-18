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


function Ship(positionArray) {
    this.positionArray = positionArray;
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

var createBoard = function () {
    posX = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    posY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    var currentTile = {};

    var count = 0;

    for (var i = 0; i < posX.length; i++) {
        for (var j = 0; j < posY.length; j++) {
            if (count % 10 == 0) {
                $("#board").append('<div class="tile smoothfade" style="clear:left"></div>');
                $("#opponentBoard").append('<div class="opponentTile smoothfade" style="clear:left"></div>');
            } else {
                $("#board").append('<div class="tile smoothfade"> </div>');
                $("#opponentBoard").append('<div class="opponentTile smoothfade"> </div>');
            }
            $(".tile").eq(count).attr("data-posx", posX[posX.length - (i + 1)]).attr("data-posy", posY[j]);
            $(".tile").eq(count).addClass("white");
            $(".opponentTile").eq(count).attr("data-posx", posX[posX.length - (i + 1)]).attr("data-posy", posY[j]);
            $(".opponentTile").eq(count).addClass("white");
            count++;

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

function toggleOpponentOverlay() {
    if ($(".overlay").display === "none") {
        $(".overlay").display = "block";
    } else {
        $(".overlay").display = "none";
    }
};

$(document).ready(function ($) {
    createBoard();
    toggleOpponentOverlay();
    var tiles = $(".tile");

    tiles.on('mouseenter', function () {
        var currentTile = $(this);
        var posX = currentTile.data("posx");
        var posY = currentTile.data("posy");
        if (ship != null) {
            // Ship exists, validate hover only if has more than 1 position
            var positionArray = ship.positionArray;

            if (positionArraycontains(positionArray, posX, posY)) {
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
                var diffX = posX.charCodeAt(0) - positionArray[0].x.charCodeAt(0);
                var diffY = posY - positionArray[0].y;
                if ((diffX == -1 || diffX == 1) && diffY == 0) {
                    // Moving horizontally
                    $(this).addClass('hover');
                } else if ((diffY == -1 || diffY == 1) && diffX == 0) {
                    // Moving vertically
                    $(this).addClass('hover');
                } else {
                    $(this).addClass('hoverRed');
                }
            } else {
                $(this).addClass('hover');
            }
        } else {
            $(this).addClass('hover');
        }
    })

    tiles.on('mouseleave', function () {
        $(this).removeClass('hover');
        $(this).removeClass('hoverRed');
    });

    tiles.on('click', function () {
        var currentTile = $(this);
        if (ship === null) {
            var positionArray = [new Position(currentTile.data("posx"), currentTile.data("posy"))];
            ship = new Ship(positionArray);
            currentTile.addClass('green');
        } else {
            if (!currentTile.hasClass('hoverRed') && !positionArraycontains(ship.positionArray, currentTile.data("posx"), currentTile.data("posy"))) {
                // Valid, add position
                ship.positionArray.push(new Position(currentTile.data("posx"), currentTile.data("posy")));
                ship.positionArray.sort(sortPositionArray);
                currentTile.addClass('green');
            } else if (currentTile.hasClass('green')) {
                // Remove selected ship tile
                var success = removePositionFromArray(ship.positionArray, currentTile.data("posx"), currentTile.data("posy"));
                if (success) {
                    currentTile.removeClass('green');
                }
            }
        }
        console.log("Last Clicked Tile : " + currentTile.data("posx"));

    })


});

