We recommend pursuing the development of the SmallSat Shipping Detection as it will provide ample utility in edge detection from satellite imaging and radar. Despite the software being specialized in ship detection the software could be replicated and edited to be used in multiple scenarios that involve edge detection. This project will involve data analysis of radar and image data received from satellites. We will also use a machine learning model to predict the type of ship that the satellite finds. We believe that by limiting the scope of the machine learning model and edge detection software an end-of-April integration deliverable can be achieved.

The functionality requirements of this project involve:

| Priority | Feature | Description |
| :---: | :---- | :---- |
| 1 | Image Detection Software | Edge Detection Software from satellite images. |
| 2 | Ship Categorization | Ship Detection Software to identify type of ship. |
| 3 | Back end | Integrates software and sends communication if there is a significant threat that needs action. |
| 4 | Ground Station Front End | A Visual view of the in space satellite on a map, as well as utilization of the Ground Station Decision Making Agent |
| 5 | Ground Station Decision Making Agent | Threat Detection Software to identify the severity of threat of a shipping operation. |
| 6 | Radar Detection Software | Edge Detection Software from satellite radar. |

The following technologies will be necessary to develop for the minimum viable product (MVP):

| Enabled Feature | Development Tasks |
| :---- | :---- |
| Image Edge Detection | Database management, Edge detection software from images. |
| Ship Detection | Train a machine learning model to detect type of ship from edge detection, Implement machine learning model. |
| Ground Station | A Basic ground stationg frontend as described above. |
| Waterfall cascading logic | Limit computation to areas that are of interest and report ships that are of high priority. |

