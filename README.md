## education_map

<img src="https://dl.dropbox.com/s/pw4wn4f3e0x85rn/tweet1.PNG">

__Educational Attainment in America__ is an interactive dot-density map of the US population aged 25 and over by educational attainment.  Data are summarized into five categories, which represent the highest education attained: less than high school; high school or equivalent; some college or associate's degree; bachelor's degree; and graduate degree.  Data are from the 2011-2015 American Community Survey Table B15003, distributed by [NHGIS](http://www.nhgis.org).  Dot locations are approximate and __do not__ represent the locations of individuals.  Also, as the ACS is a survey of the US population, its estimates are subject to a margin of error.  

Data preparation was completed in the R and Python programming languages, with heavy reliance on the __arcpy__ site package via ArcGIS Pro and the __sf__ R package.  The map itself is hosted by Mapbox and designed with Mapbox GL JS and dimple.js.  Major features of the map are described below; a manuscript describing the full methodology is currently in progress.    

* __Dasymetric dot-density mapping__.  The map is a __dasymetric__ dot-density map, which means that the dots are placed in relationship to ancillary geographic information that in this case describes the underlying population surface.  Educational attainment data are aggregated at the Census tract level, and dots are placed randomly within Census tracts.  Prior to the dot placement, however, Census blocks with no population in 2010 were erased from the Census tract geographies, meaning that dots are constrained to areas within tracts that had a measured population in 2010.  Given the temporal difference between the block data and tract data, some areas that went from 0 population to populated between 2010 and 2015 may be excluded.    

* __Zoom-dependent data and styling__.  To facilitate clarity at different zoom levels, the map displays progressively fewer dots as the user zooms out.  When fully zoomed in, one dot represents approximately 25 people; when fully zoomed out, one dot represents approximately 500 people.  Additionally, dot sizes increase as the user zooms in.  

* __Filter data with an interactive legend__. One issue with dot-density maps is that dots can occlude other dots, especially in high-density areas like Manhattan.  To help resolve this, users can click entries in the legend to turn on and off dots for each category.  

* __Summarize visible data with an interactive chart__.  While dot-density maps are effective at giving a general sense of the distribution of a multivariate attribute, it can be difficult for users to summarize the visible data.  By clicking the corresponding button, the map will tabulate the visible dots on the screen and provide a percentage breakdown of the visible dots by category on a chart in the sidebar.  

Given the size of the raw and derived data used for this map (over 50 GB), data are not provided in this repository.  The required data from NHGIS are as follows: 

* 2011-2015 US Census tract geography
* 2011-2015 ACS table B15003, Educational Attainment for the Population 25 Years and Over, for Census tracts; 
* 2010 US Census block geography for all 50 states plus DC; 
* 2010 US Census table P1, Total Population, for Census blocks.  

Running the following scripts in order, if all requisite software is installed, will reproduce the data.  Note that you must use ArcGIS Pro's conda environment to get access to __arcpy__.  Also, you would need to change the NHGIS folder paths and file names to your own.  

1. `R/unzip_blocks.R`
2. `R/process_blocks.R`
3. `python/erase_from_tracts.py`
4. `R/combine_dasymetric_tracts.R`
5. `python/usa_dots.py`


