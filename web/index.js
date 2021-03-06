var osm_img = "<img src='img/osm.svg' heigth='20px' width='20px' />"
var bus_img = "<img src='img/bus.svg' heigth='20px' width='20px' />"
var wheelchair_img = "<img src='img/wheelchair.svg' heigth='20px' width='20px' />"
var shelter_img = "<img src='img/shelter.svg' heigth='20px' width='20px' />"
var tactile_img = "<img src='img/tactile.svg' heigth='20px' width='20px' />"
var bench_img = "<img src='img/bench.svg' heigth='20px' width='20px' />"
var departures_img = "<img src='img/departures.svg' heigth='20px' width='20px' />"

var map = new mapboxgl.Map({
    container: 'map',
    style: 'glstyle.json',
    center: [
        1.8659, 46.1662
    ],
    zoom: 11.952145030855498,
    hash: true
});
map.on('load', function () {

    map.on('mouseenter', 'transport_points', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'transport_points', function () {
        map.getCanvas().style.cursor = '';
    });
    map.on('click', 'transport_points', function (e) {
        var feature = e.features[0];
        const routes_at_stop = JSON.parse(feature.properties.routes_at_stop)
        let html = ""
        html += `<h2> <a target="_blank" href="http://osm.org/node/${feature.properties.osm_id}">${bus_img}</a> `
        html += ` ${feature.properties.name || "pas de nom :("}</h2>`;

        html += "<p>"
        html += `${ (feature.properties.has_bench)
            ? bench_img
            : ""} `;
        html += `${ (feature.properties.has_shelter)
            ? shelter_img
            : ""} `;
        html += `${ (feature.properties.has_departures_board)
            ? departures_img
            : ""} `;
        html += `${ (feature.properties.is_wheelchair_ok)
            ? wheelchair_img
            : ""} `;
        html += `${ (feature.properties.has_tactile_paving)
            ? tactile_img
            : ""} `;
        html += "</p>"

        html += '<ul>'
        for (const route of routes_at_stop) {
            html += ` <div style="float: left;width:10px;height:20px;background:${route['rel_colour'] || "grey"};"></div> `
            html += ` &nbsp; [${route['rel_network'] || '??'}] ${route['rel_ref'] || '??'} > ${route['rel_destination'] || '??'} `
            html += `<a href='#' onclick='filter_on_one_route(${route['rel_osm_id']})'>Voir la ligne</a> </br>`
        }
        html += '</ul>'
        var popup = new mapboxgl.Popup({closeButton: false}).setLngLat(e.lngLat).setHTML(html).addTo(map);
    });
})

function filter_on_one_route(route_id) {
    //route_id = -7773405
    map.setFilter('transport_ways_filtered_outline', ["==", "rel_osm_id", route_id]);
    map.setFilter('transport_ways_filtered', ["==", "rel_osm_id", route_id]);
    map.setFilter('transport_points_filtered', ["==", "rel_osm_id", route_id]);
    caisson.add_content(`todo - ajouter des détails sur la ligne <br>
        <a href='#' onclick='reset_filters_and_show_all_lines()'>Supprimer la ligne</a> </br>`)
};


function reset_filters_and_show_all_lines() {
    map.setFilter('transport_ways_filtered_outline', ["==", "rel_osm_id", "dumb_filter_again"]);
    map.setFilter('transport_ways_filtered', ["==", "rel_osm_id", "dumb_filter_again"]);
    map.setFilter('transport_points_filtered', ["==", "rel_osm_id", "dumb_filter_again"]);
    caisson.remove()
}
