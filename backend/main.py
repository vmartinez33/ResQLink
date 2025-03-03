import sqlite3
import math
import unittest

# Database file path
DB_FILE = 'datos/Points_Along_Line.sqlite'

def connect_database():
    """Connects correctyl to the SQLite database ."""
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM interpolated_points;")
            rows = cursor.fetchall()

            if not rows:
                print("No records found in the 'interpolated_points' table.")
                return
            
            print(f"Results from 'interpolated_points' table ({len(rows)} rows):\n")
            for row in rows:
                try:
                    lat, lon = map(float, row[3].split(', '))
                    print(f"Start: {lat}, End: {lon}")
                except ValueError:
                    print(f"Skipping invalid coordinate data: {row[3]}")
    except sqlite3.Error as e:
        print(f"Database error: {e}")

def euclidean_distance(p1, p2):
    """Computes the Euclidean distance between two points."""
    return math.dist(p1, p2)

def is_route_within_limit(route, max_distance):
    """Checks if the distance between consecutive points in a route is within the allowed limit."""
    return all(euclidean_distance(route[i], route[i + 1]) <= max_distance for i in range(len(route) - 1))

def is_point_within_perimeter(point, route, perimeter):
    """Determines if a given point falls within the allowed perimeter of any point in the route."""
    return any(euclidean_distance(point, route_point) <= perimeter for route_point in route)

def check_point_on_route(point, route, max_distance, perimeter, return_message=False):
    """Validates if a point is inside the route perimeter and if the route follows distance constraints.
    
    Args:
        point: Tuple with the coordinates of the point (x, y).
        route: List of points representing the route.
        max_distance: Maximum distance allowed between consecutive points in the route.
        perimeter: Perimeter of the route.
        return_message: If True, return a descriptive message; otherwise, return a boolean.
    
    Returns:
        Either a descriptive message or a boolean indicating if the point is within the perimeter and route limits.
    """
    # Check if the route is within the distance limits
    if not is_route_within_limit(route, max_distance):
        if return_message:
            return "The route does not comply with distance limits between consecutive points."
        return False
    
    # Check if the point is within the perimeter
    if is_point_within_perimeter(point, route, perimeter):
        if return_message:
            return "The point is within the route perimeter."
        return True
    else:
        if return_message:
            return "The point is outside the route perimeter."
        return False



connect_database()

# Unit tests
class TestRouteFunctions(unittest.TestCase):
    def setUp(self):
        self.route = [(1, 1), (2, 2), (3, 3), (4, 4)]
        self.max_distance = 10.0
        self.perimeter = 10.0

    def test_euclidean_distance(self):
        self.assertAlmostEqual(euclidean_distance((0, 0), (3, 4)), 5.0)

    def test_is_route_within_limit(self):
        self.assertTrue(is_route_within_limit(self.route, self.max_distance))
        self.assertFalse(is_route_within_limit([(1, 1), (20, 20)], self.max_distance))

    def test_is_point_within_perimeter(self):
        self.assertTrue(is_point_within_perimeter((2.5, 2.5), self.route, self.perimeter))
        self.assertFalse(is_point_within_perimeter((20, 20), self.route, self.perimeter))

    def test_check_point_on_route(self):
        self.assertEqual(check_point_on_route((2, 2), self.route, self.max_distance, self.perimeter,True), "The point is within the route perimeter.")
        self.assertEqual(check_point_on_route((-9.5, 11.4), self.route, self.max_distance, self.perimeter,True), "The point is outside the route perimeter.")
   
    def test_check_point_on_route_2(self):
        self.assertEqual(check_point_on_route((2, 2), self.route, self.max_distance, self.perimeter,False), True)
        self.assertEqual(check_point_on_route((-9.5, 11.4), self.route, self.max_distance, self.perimeter,False), False)
    
  
    def test_small_perimeter(self):
        self.assertFalse(is_point_within_perimeter((2.5, 2.5), self.route, 0.5))

    def test_large_perimeter(self):
        self.assertTrue(is_point_within_perimeter((10, 10), self.route, 20))

    def test_route_exceeds_limit(self):
        long_route = [(0, 0), (50, 50), (100, 100)]
        self.assertFalse(is_route_within_limit(long_route, self.max_distance))

    def test_point_near_route(self):
        self.assertTrue(is_point_within_perimeter((3.1, 3.1), self.route, 0.2))

    def test_point_far_from_route(self):
        self.assertFalse(is_point_within_perimeter((10, 10), self.route, 1.0))

if __name__ == "__main__":
    unittest.main()
