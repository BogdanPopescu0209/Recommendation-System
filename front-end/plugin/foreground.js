let holiday1 = {};
let holiday2 = {};
let holiday3 = {};

chrome.storage.sync.get(['key'], function (result) {

    holiday1 = JSON.parse(result.key.holiday1);
    holiday2 = JSON.parse(result.key.holiday2);
    holiday3 = JSON.parse(result.key.holiday3);

});

setTimeout(function () {

    if (Object.keys(holiday1).length != 0 && Object.keys(holiday2).length != 0 && Object.keys(holiday3).length != 0) {

        const parent = document.querySelector('#extabar')
        const child = document.querySelector('#slim_appbar')

        const newDiv1 = document.createElement("div");
        newDiv1.id = "div1";

        const newDiv2 = document.createElement("div");
        newDiv2.id = "div2";

        const newP1 = document.createElement("p");
        newP1.id = "p1";
        newP1.innerText = "Get";

        const newP2 = document.createElement("p");
        newP2.id = "p2";
        newP2.innerText = "away";

        const newP3 = document.createElement("p");
        newP3.id = "p3";

        const newDiv3 = document.createElement("div");
        newDiv3.id = "div2";

        const newP4 = document.createElement("p");
        newP4.id = "p1";
        newP4.innerText = "Get";

        const newP5 = document.createElement("p");
        newP5.id = "p2";
        newP5.innerText = "away";

        const newP6 = document.createElement("p");
        newP6.id = "p6";

        const newDiv4 = document.createElement("div");
        newDiv4.id = "div2";

        const newP7 = document.createElement("p");
        newP7.id = "p1";
        newP7.innerText = "Get";

        const newP8 = document.createElement("p");
        newP8.id = "p2";
        newP8.innerText = "away";

        const newP9 = document.createElement("p");
        newP9.id = "p9";

        newDiv1.append(newDiv2, newP1, newP2, newP3, newDiv3, newP3, newP4, newP5, newP6, newP7, newP8, newP9);

        parent.parentNode.insertBefore(newDiv1, child.nextSibling);

        if (holiday3.type === "beach") {

            let beachHoliday = document.getElementById("p9")
            beachHoliday.innerHTML = "<a class='styleP'>Looking for some holiday inspiration? Great value package holiday to " + holiday3.city + ". With more than " + holiday3.beaches + " beaches to choose from. £" + holiday3.hotel + " for " + holiday3.nights + " and flight for £" + holiday3.flight + ". &#9972 &#127958 &#127774 &#127865 &#127940</a>"

            beachHoliday.addEventListener('click', () => {

                chrome.runtime.sendMessage({ message: "Recommendations" })

            })

        }

        if (holiday3.type === "ski") {

            let skiHoliday = document.getElementById("p9")
            skiHoliday.innerHTML = "<a class='styleP'>Check out a fantastic holiday to " + holiday3.city + " with more than " + holiday3.mountains + " ski tracks to choose from. Bargain hotel £" + holiday3.hotel + " for " + holiday3.nights + " nights and flight £" + holiday3.flight + ". &#9924 &#10052 &#9975 &#9976 &#127938</a>"

            skiHoliday.addEventListener('click', () => {

                chrome.runtime.sendMessage({ message: "Recommendations" })

            })

        }

        if (holiday3.type === "normal") {

            let holidayNormal3 = document.getElementById("p9")
            holidayNormal3.innerHTML = "<a class='styleP'>Check out a fantastic holiday to " + holiday3.city + " with more than " + holiday3.attractions + " attractions to choose from. Bargain hotel £" + holiday3.hotel + " for " + holiday3.nights + " nights. &#127384 &#127378 &#127753 &#127775 &#127828</a>"

            holidayNormal3.addEventListener('click', () => {

                chrome.runtime.sendMessage({ message: "Recommendations" })

            })

        }

        let holidayNormal1 = document.getElementById("p3")
        holidayNormal1.innerHTML = "<a class='styleP'>Are you looking for an amazing holiday? With more than " + holiday1.museums + " museums, " + holiday1.galleries + " tourist attractions, " + holiday1.attractions + " restaurants, " + holiday1.city + " sounds like a fantastic destination. Go check it out. £" + holiday1.hotel + " for " + holiday1.nights + " nights. &#127963 &#128248 &#127751 &#127758 &#128099</a>"

        let holidayNormal2 = document.getElementById("p6")
        holidayNormal2.innerHTML = "<a class='styleP'>Looking for some holiday inspiration? More than " + holiday2.restaurants + " restaurants from which to choose makes " + holiday2.city + " sounds like a great experience. Hotel for " + holiday2.nights + " nights £" + holiday2.hotel + " and flight £" + holiday2.flight + ". &#128205 &#127870 &#128525 &#128293 &#128285</a>"


        holidayNormal1.addEventListener('click', () => {

            chrome.runtime.sendMessage({ message: "Recommendations" })

        })

        holidayNormal2.addEventListener('click', () => {

            chrome.runtime.sendMessage({ message: "Recommendations" })

        })

    }

}, 100);








