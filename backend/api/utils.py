from decimal import Decimal

def calculate_price(hours):

    if hours <= 1:
        return Decimal("50")

    if hours <= 2:
        return Decimal("100")

    if hours <= 3:
        return Decimal("150")

    return Decimal("150") + (
        Decimal(hours - 3) * Decimal("50")
    )