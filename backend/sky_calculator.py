import ephem
from datetime import datetime
import math

class SkyCalculator:
    def __init__(self):
        self.objects = {
            'moon': ephem.Moon(),
            'mars': ephem.Mars(),
            'venus': ephem.Venus(),
            'jupiter': ephem.Jupiter(),
            'saturn': ephem.Saturn()
        }
        
        self.bright_stars = {
            'Sirius': ('Canis Major', -1.46),
            'Vega': ('Lyra', 0.03),
            'Arcturus': ('Boötes', -0.05),
            'Rigel': ('Orion', 0.13),
            'Betelgeuse': ('Orion', 0.45)
        }
    
    def calculate_visibility(self, lat, lon, time=None):
        observer = ephem.Observer()
        observer.lat = str(lat)
        observer.lon = str(lon)
        observer.elevation = 0
        
        if time is None:
            time = datetime.utcnow()
        observer.date = time
        
        visible_objects = []
        
        # Calculate Sun position for determining darkness
        sun = ephem.Sun()
        sun.compute(observer)
        is_dark = sun.alt < -6 * ephem.degree  # Civil twilight
        
        # Calculate planets and Moon
        for name, obj in self.objects.items():
            obj.compute(observer)
            if obj.alt > 0:  # Above horizon
                object_data = {
                    'name': name.capitalize(),
                    'type': 'planet' if name not in ['sun', 'moon'] else name,
                    'constellation': ephem.constellation(obj)[1],
                    'altitude': math.degrees(float(obj.alt)),
                    'azimuth': math.degrees(float(obj.az)),
                    'magnitude': float(obj.mag)
                }
                
                if name == 'moon':
                    object_data['phase'] = obj.phase
                    
                visible_objects.append(object_data)
        
        # Add visible bright stars if dark
        if is_dark:
            for star_name, (constellation, magnitude) in self.bright_stars.items():
                star = ephem.star(star_name)
                star.compute(observer)
                
                if star.alt > 0:
                    visible_objects.append({
                        'name': star_name,
                        'type': 'star',
                        'constellation': constellation,
                        'altitude': math.degrees(float(star.alt)),
                        'azimuth': math.degrees(float(star.az)),
                        'magnitude': magnitude
                    })
        
        return visible_objects