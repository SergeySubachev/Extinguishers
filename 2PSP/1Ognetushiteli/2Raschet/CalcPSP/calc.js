window.onload = Init;

var iRoomType;
var divSquare;
var divResult
var chbA;
var chbB;
var chbC;
var chbD;
var chbE;

function Init() {
    divSquare = document.getElementById("divSquare");
    divResult = document.getElementById("divResult");
    chbA = document.getElementById("chbA");
    chbB = document.getElementById("chbB");
    chbC = document.getElementById("chbC");
    chbD = document.getElementById("chbD");
    chbE = document.getElementById("chbE");
    OnRoomTypeChange(0);
}

function OnRoomTypeChange(ind) {
    iRoomType = ind;
    divSquare.hidden = (iRoomType == 3);
    document.getElementById("parD").hidden = (iRoomType == 3);
}

function AddStr(str, added) {
    if (str == "")
        return added;
    else
        return str + ", " + added;
}

function btnCalcClick() {
    while (divResult.children.length > 0) {
        divResult.children.item(0).remove();
    }

    var roomSquare = document.getElementById("edtSquare").value;
    if (iRoomType < 3 && (roomSquare == undefined || roomSquare <= 0)) {
        var newp = document.createElement("p");
        newp.innerHTML = "Укажите площадь помещения."
        newp.style.color = "red";
        divResult.appendChild(newp);
        return;
    }

    if (iRoomType == 2 && roomSquare <= 100) {
        var newp = document.createElement("p");
        newp.innerHTML = "Помещение категории Д по взрывопожарной и пожарной опасности не оснащается огнетушителями, если площадь этого помещения не превышает 100 м<sup>2</sup>.";
        divResult.appendChild(newp);
        return;
    }

    if (!chbA.checked && !chbB.checked && !chbC.checked && (iRoomType == 3 || !chbD.checked) && !chbE.checked) {
        var newp = document.createElement("p");
        newp.innerHTML = "Укажите возможные классы пожаров."
        newp.style.color = "red";
        divResult.appendChild(newp);
        return;
    }

    var A_B_C_E = ["", "", "", ""]; //ранг D - отдельные огнетушители
    var rangA = iRoomType == 0 ? "3A" : "2A";
    var rangB = iRoomType == 0 ? "70B" : "55B";
    if (chbA.checked) {
        A_B_C_E[0] = rangA;
    }
    if (chbB.checked) {
        A_B_C_E[1] = rangB;
    }
    if (chbC.checked) {
        A_B_C_E[1] = rangB;
        A_B_C_E[2] = "C";
    }
    if (chbE.checked) {
        A_B_C_E[1] = rangB;
        A_B_C_E[2] = "C";
        A_B_C_E[3] = "E";
    }
    
    var str = "";
    for (const it of A_B_C_E) {
        if (it != "") {
            if (str != "") str += ", ";
            str += it;
        }
    }
    
    if (chbD.checked) {
        if (str == "")
            str = "D";
    }

    var newp = document.createElement("p");
    newp.innerHTML = `Указанное помещение (помещения) необходимо оснащать огнетушителями с рангом тушения модельного очага \"${str}\".`;
    divResult.appendChild(newp);

    if (str != "D" && chbD.checked) {
        newp = document.createElement("p");
        newp.innerHTML = "В связи с тем, что имеется возможность возникновения пожара класса D, в дополнение к указанным огнетушителям следует установить огнетушители с рангом тушения модельного очага \"D\".";
        divResult.appendChild(newp);
    }

    var r = iRoomType == 0 ? 30 : iRoomType == 1 ? 40 : iRoomType == 2 ? 70 : 20;
    newp = document.createElement("p");
    newp.innerHTML = "Количество огнетушителей определяется, исходя из требования: чтобы расстояние от возможного очага пожара до места размещения переносного огнетушителя (с учетом перегородок, дверных проемов, возможных загромождений, оборудования и др.) не превышало " + r + " метров. Если расстояние превышает это значение - количество огнетушителей должно быть увеличено.";
    divResult.appendChild(newp);

    newp = document.createElement("p");
    newp.innerHTML = "Помещения, оборудованные автоматическими стационарными установками пожаротушения, обеспечиваются огнетушителями на 50 процентов от расчетного количества огнетушителей.";
    divResult.appendChild(newp);

    newp = document.createElement("p");
    newp.innerHTML = "Возможно использование огнетушителей более высокого ранга, при выполнении требований к указанному расстоянию.";
    divResult.appendChild(newp);

    if (iRoomType == 3) {
        newp = document.createElement("p");
        newp.innerHTML = "Также необходимо учесть, что в общественных зданиях и сооружениях независимо от расчетного количества на каждом этаже должно быть размещено не менее 2 огнетушителей.";
        divResult.appendChild(newp);
    }

    //передвижные - если А,Б,В,Г более 500 м.кв.
    if (iRoomType < 2 && roomSquare > 500) {
        newp = document.createElement("p");
        newp.innerHTML = "Здания и сооружения производственного и складского назначения площадью более 500 кв. метров дополнительно оснащаются передвижными огнетушителями по нормам, предусмотренным приложением N 2 к Правилам противопожарного режима в Российской Федерации. Не требуется оснащение передвижными огнетушителями зданий и сооружений категории Д по взрывопожарной и пожарной опасности.";
        divResult.appendChild(newp);

        var normSquare = iRoomType == 0 ? 500.0 : 800.0;
        var N = Math.ceil(roomSquare / normSquare); //кол-во больших

        //ранг D - отдельные огнетушители
        var A_B_C_E_big = ["", "", "", ""];
        var A_B_C_E_small = ["", "", "", ""];
        var rangA_big = "10A";
        var rangA_small = "6A";
        var rangB_big = "233B";
        var rangB_small = "144B";
        if (chbA.checked) {
            A_B_C_E_big[0] = rangA_big;
            A_B_C_E_small[0] = rangA_small;
        }
        if (chbB.checked) {
            A_B_C_E_big[1] = rangB_big;
            A_B_C_E_small[1] = rangB_small;
        }
        if (chbC.checked) {
            if (iRoomType == 0) {
                A_B_C_E_big[0] = rangA_big;
                A_B_C_E_small[0] = rangA_small;
            }
            A_B_C_E_big[1] = rangB_big;
            A_B_C_E_small[1] = rangB_small;
            A_B_C_E_big[2] = "C";
            A_B_C_E_small[2] = "C";
        }
        if (chbE.checked) {
            if (iRoomType == 0) {
                A_B_C_E_big[0] = rangA_big;
                A_B_C_E_small[0] = rangA_small;
            }
            A_B_C_E_big[1] = rangB_big;
            A_B_C_E_small[1] = rangB_small;
            A_B_C_E_big[2] = "C";
            A_B_C_E_small[2] = "C";
            A_B_C_E_big[3] = "E";
            A_B_C_E_small[3] = "E";
        }

        var str_big = "";
        for (const it of A_B_C_E_big) {
            if (it != "") {
                if (str_big != "") str_big += ", ";
                str_big += it;
            }
        }
        var str_small = "";
        for (const it of A_B_C_E_small) {
            if (it != "") {
                if (str_small != "") str_small += ", ";
                str_small += it;
            }
        }

        if (chbD.checked) {
            if (str_big == "") {
                str_big = "D";
                str_small = "D";
            }
        }

        newp = document.createElement("p");
        newp.innerHTML = `Количество передвижных огнетушителей: ${N} шт. ранга \"${str_big}\". При этом каждый огнетушитель ранга \"${str_big}\" можно заменить двумя огнетушителями ранга \"${str_small}\".`;
        divResult.appendChild(newp);

        if (str_big != "D" && chbD.checked) {
            newp = document.createElement("p");
            newp.innerHTML = "В связи с тем, что имеется возможность возникновения пожара класса D, в дополнение к указанным огнетушителям следует устанавливать передвижные огнетушители с рангом тушения модельного очага \"D\" (" + N + " шт.).";
            divResult.appendChild(newp);
        }
    }
}
