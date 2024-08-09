// Fotografia aerea de parte de Liberia 1965 por IGN

// Cargar una imagen RGB y tabla de vectores
var image = ee.Image("projects/ee-oasotob/assets/Liberia_1965R")
              .select(['b1']);
              
// Cargar poligonos de redondel 1965
var table = ee.FeatureCollection("projects/ee-oasotob/assets/Redondel");

// Crear una máscara donde los valores sean mayores 18
var mask = image.gte(18);

// Aplicar la máscara a la imagen
var maskedImage = image.updateMask(mask);

// Colorear poligonos de rendondel
var colorTable = ee.Dictionary({
  'Redondel': '00FF00',
  'Tablado': 'Ffff00',
  'Toril': 'FF0000',
  'Manga': 'Ff6600',
  'Corral Descarga': 'FF00FF',
  'Corral Carga': '0000FF',
  'Rampa': 'B2FFFF',
});

var styled = table
  .map(function (feature) {
    return feature.set('style', {
      fillColor: colorTable.get(feature.get('Nombre'), '777777')
    });
  })
  .style({
    styleProperty: 'style',
  });

// Crear dos mapas
var leftMap = ui.Map();
var rightMap = ui.Map();

// Centrar los mapas en la misma ubicación
leftMap.centerObject(table, 18);
rightMap.centerObject(table, 18);

// Especicaciones de paneles
leftMap.setControlVisibility(false, true);
rightMap.setControlVisibility(false, true);
leftMap.setOptions('HYBRID');
rightMap.setOptions('HYBRID');


// Añadir la imagen a ambos mapas
//leftMap.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'True Color');
rightMap.addLayer(maskedImage, {min: 0, max: 254},'Foto aerea 1965');
rightMap.addLayer(styled,{opacity:0.5},'Redondel');

// link the maps
var linkedMaps = ui.Map.Linker([leftMap, rightMap]);

// Crear un panel dividido
var splitPanel = ui.SplitPanel({
  firstPanel: linkedMaps.get(0),
  secondPanel: linkedMaps.get(1),
  orientation: 'horizontal',
  wipe: true,
  style: {stretch: 'both'}
});

// Añadir el panel dividido a la interfaz de usuario
ui.root.clear();
ui.root.add(splitPanel);
