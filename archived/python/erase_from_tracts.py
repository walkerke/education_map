import arcpy
import arcpy.management as mg
arcpy.env.overwriteOutput = True

state_codes = {
    'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15',
    'FL': '12', 'WY': '56', 'NJ': '34', 'NM': '35', 'TX': '48',
    'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36',
    'PA': '42', 'AK': '02', 'NV': '32', 'NH': '33', 'VA': '51', 'CO': '08',
    'CA': '06', 'AL': '01', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13',
    'IN': '18', 'IA': '19', 'MA': '25', 'AZ': '04', 'ID': '16', 'CT': '09',
    'ME': '23', 'MD': '24', 'OK': '40', 'OH': '39', 'UT': '49', 'MO': '29',
    'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MS': '28',
    'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'
}

tracts = "data-raw/nhgis0077_shape/us_tract_2015.shp"

tract_layer = mg.MakeFeatureLayer(tracts)
          
def erase_and_clean(tract_id, block_id):
    tract_clause = '"STATEFP" = ' + "'" + tract_id + "'"
    # First, generate the state-specific layer
    state_tracts = mg.SelectLayerByAttribute(tract_layer, "NEW_SELECTION", tract_clause)
    # Next, read in the appropriate block filter
    blocks = "data/blocks/nopop/" + block_id + "_nopop.shp"
    block_layer = mg.MakeFeatureLayer(blocks)
    # Run the Erase tool
    out_erase = "data/erase/" + block_id + "_erase.shp"
    arcpy.analysis.Erase(state_tracts, block_layer, out_feature_class = out_erase)
    # Check for slivers and remove them - let's set a threshold of 5000 sq meters
    out_singlepart = "data/singlepart/" + block_id + "_single.shp"
    mg.MultipartToSinglepart(out_erase, out_singlepart)
    single_layer = mg.MakeFeatureLayer(out_singlepart)
    mg.AddGeometryAttributes(single_layer, Geometry_Properties = "AREA", Area_Unit = "SQUARE_METERS")
    # Now, specify the where clause and dissolve the remainder
    area_clause = '"POLY_AREA" >= 5000'
    mg.SelectLayerByAttribute(single_layer, "NEW_SELECTION", area_clause)
    out_dissolve = "data/dissolve/" + block_id + "_dissolve.shp"
    mg.Dissolve(single_layer, out_dissolve, dissolve_field = "GISJOIN")
    
# Run it

for state, fips in sorted(state_codes.items()): 
    print("Processing", state, "...")
    erase_and_clean(fips, state)
    print("Finished", state, "!")
    






