# -*- coding: utf-8 -*-
"""
File for creating some nice csv files for happiness visualization project

Run this script from folder that contains both the csv that extends and world happiness data folder

"""

import pandas as pd


# UNCOMMENT FIRST RUN ONLY!
#data = pd.read_csv('world-happiness-report/2016.csv') 

# Chose name for file to extend, OBS same in bottom!
# UNCOMMENT AFTER FIRST RUN!
data = pd.read_csv('extended2016.csv') 

#SET FILENAME FOR GAPMINDER DATASET!
csvfilename = 'working_hours_per_week'
newData = pd.read_csv( csvfilename + '.csv')

df = pd.DataFrame(data)
newdf = pd.DataFrame(newData)


# TODO: Checks to see if worth computing, end here if
# - column already exists
# - year does not exist in new data
 
 
countrCol = newdf.loc[:,'country']
yearCol = newdf.loc[:, '2016']
newdf = pd.DataFrame(pd.DataFrame(yearCol).get_values(), index = countrCol)


# The countries existing in happydata that we want can add data to
happyCs = df.loc[:,'Country']
newcol = pd.DataFrame(index=range(0,df.shape[0]),columns=[csvfilename])

# Set values in the new column that matches the countries of the dataset that is to be extended
for row in range(df.shape[0]):
    	
    if happyCs[row] in newdf.index:
        newcol.at[row,csvfilename] = newdf.loc[happyCs[row], 0]
        # print(happyCs[row] + ' has value ' + str(newdf.loc[happyCs[row],0]))
        #else:
        # value is alredy nan by default
        # print(happyCs[row]  + ' not found!')
 
# Overwrite the old dataset with one with a new extra column
df[csvfilename] = newcol
# %%
df.to_csv('extended2016.csv', index=False)