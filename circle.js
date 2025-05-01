const PI = 3.14159

function area(radius) {
    return PI * radius * radius;
}

function perimeter(radius) {
    return 2 * PI * radius;
}

exports.area = area;
exports.perimeter = perimeter;