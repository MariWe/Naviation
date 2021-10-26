let model, next, lat1, lat2, lon1, lon2, one, obj, d, lat, lon;
let arrayLat = [];
let arrayLon = [];
let sLat = 0; 
let sLon = 0;
let mLat = 0;
let mLon = 0;

window.onload = () => {

    one = document.getElementById('one');
    Mittelwert();
    //getLocation();
    createButton();

    let dest = document.getElementById('five').getAttribute('gps-entity-place');
    let zielLat = dest.latitude;
    let zielLon = dest.longitude;

    //"Navigation"
    function Navigation() {
        next = document.getElementById(one.dataset.next);
        lat2 = parseFloat(one.dataset.lat);
        lon2 = parseFloat(one.dataset.lon);
        zielDistanz(lat1, lon1, zielLat, zielLon);
        Distanz(lat1, lon1, lat2, lon2);
        Display();
        if (d < 5) {
            if (next.dataset.next === "null") {
                const div = document.querySelector('#demo');
                div.innerText = "Sie haben Ihr Ziel erreicht!";
            }
            else {
                one = next;
                obj = next;
            }
        }
    }

    function Display() {
        const div = document.querySelector('#demo');
        div.innerText = "Distanz bis zum Ziel: " + dis.toFixed(2) + "m";
    }

    function zielDistanz(lat1, lon1, zielLat, zielLon) {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = zielLat * Math.PI / 180;
        const Δφ = (zielLat - lat1) * Math.PI / 180;
        const Δλ = (zielLon - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        dis = R * c; // in metres
        return dis;
    }

    //Aktuelle Position
    function getLocation() {
        navigator.geolocation.watchPosition(function (position) {
            aktuell = position.coords;
            lat1 = aktuell.latitude;
            lon1 = aktuell.longitude;
            Navigation();
            Pointing();
            return lat1, lon1;
        })
    }

    function Mittelwert() {
            navigator.geolocation.watchPosition(function (position) {
                arrayLat.push(position.coords.latitude);
                arrayLon.push(position.coords.longitude);
                console.log(arrayLat, arrayLon);
                if (arrayLat.length == 10 && arrayLon.length == 10) {
                    for (i = 0; i < 10; i++) {
                        sLat = sLat + arrayLat[i];
                        sLon = sLon + arrayLon[i];
                    }
                    mLat = sLat / 10;
                    mLon = sLon / 10;
                    arrayLat = [];
                    arrayLon = [];
                    sLat = 0;
                    sLon = 0;
                    lat1 = mLat;
                    lon1 = mLon; 
                    Navigation();
                    Pointing();
                    return lat1, lon1;
                }
            })
    }

    //Ausrichtung des Pfeils
    function Pointing() {
        var pfeil = document.querySelector('#pfeil');
        var position = one.object3D.position;
        pfeil.object3D.lookAt(new THREE.Vector3(position.x, position.y, position.z));
    }

    //Button zum Erzeugen des Objektes + Vergabe der Style-Elemente 
    function createButton() {
        let btn = document.createElement("button");
        btn.innerHTML = "Click Me!";
        document.body.appendChild(btn);
        btn.setAttribute('id', 'btn');
        btn.style.color = "rgb(53, 50, 50)";
        btn.style.position = "fixed";
        btn.style.zIndex = "999999";
        btn.style.left = "40%";
        btn.style.bottom = "5%";
        btn.style.fontSize = "1.25em";
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        btn.style.fontFamily = "fantasy";
        btn.style.borderRadius = "5px";

        btn.onclick = function () {
            createElement();
            setTimeout(function () {
                update();
            }, 100);
        };
    }

    function createElement() {
        model = document.createElement('a-box');
        document.querySelector('a-scene').appendChild(model);
        model.setAttribute('material', 'color: maroon; roughness: 1.0; metalness: 0.5;');
        model.setAttribute('id', 'box');
        model.setAttribute('scale', '0.5 0.5 0.5');
        model.setAttribute('gps-entity-place', 'latitude: ${lat1}; longitude: ${lon1};');
        model.setAttribute('position', '1 1 -5');
    }

    function update() {
        model.setAttribute('position', { x: 1, y: 1, z: -5 });
    }

    //distanzBerechnung
    //cr: "https://www.movable-type.co.uk/scripts/latlong.html"
    function Distanz(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = R * c; // in metres
        return d;
    }
}
