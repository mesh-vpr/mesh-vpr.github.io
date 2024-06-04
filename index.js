mapboxgl.accessToken = 'pk.eyJ1IjoibG9sbGVrbyIsImEiOiJjbGFzM2IwamwxeWtuM3hsYjBlbWphNmFxIn0.4Tt2LXiowsZlAwBh0NsRfg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [12.550343, 55.665957],
    zoom: 8
});

function createCustomMarker(image_src) {
    const el = document.createElement('img');
    el.className = 'map-marker';
    el.src = image_src;

    el.onclick = () => {
        el.classList.toggle("active");
    }

    return el;
}

let markers = [];

function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
}

function setMap(query_btn) {
    clearMarkers();

    query_btn.classList.add("active");

    query_btn.parentElement.querySelectorAll(".example-query").forEach(btn => {
        if (btn != query_btn) {
            btn.classList.remove("active");
        }
    });

    const query_img = query_btn.getElementsByTagName("img")[0];
    console.log(query_img);

    const query_path = query_img.src;
    const preds_paths = query_img.dataset.preds.split(";");

    coord_avg = [0, 0];

    const images_paths = [query_path, ...preds_paths];

    images_paths.forEach(image_path => {
        const marker_element = createCustomMarker(image_path);
        if (image_path == query_path) {
            marker_element.style.border = "3px solid #015C92";
            marker_element.style.zIndex = "999";
        } else if (image_path.includes("success")) {
            marker_element.style.border = "3px solid #75975e";
            marker_element.style.zIndex = "666";
        }else if (image_path.includes("failure")) {
            marker_element.style.border = "3px solid #c30010";
        }
        const image_marker = new mapboxgl.Marker({element: marker_element});
        
        const image_lon = parseFloat(image_path.split("@")[2]);
        const image_lat = parseFloat(image_path.split("@")[1]);
        coord_avg[0] += image_lon;
        coord_avg[1] += image_lat;
        image_marker.setLngLat([image_lon, image_lat]);
        image_marker.addTo(map);
        markers.push(image_marker);
    });

    map.resize();
    map.flyTo({center: [coord_avg[0] / images_paths.length, coord_avg[1] / images_paths.length], zoom: 12});
}

function closeMap() {
    clearMarkers();
    document.getElementById("map-container").style.display = "none";
}