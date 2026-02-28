from math import tanh


def _normalize(value: float | None, scale: float) -> float:
    if value is None:
        return 0.0
    return (tanh(value / scale) + 1) / 2


def calculate_momentum_score(hiring_velocity: float | None, linkedin_growth: float | None) -> float:
    hiring_component = _normalize(hiring_velocity, scale=15.0)
    linkedin_component = _normalize(linkedin_growth, scale=25.0)

    weighted = (hiring_component * 0.55) + (linkedin_component * 0.45)
    score = max(0.0, min(100.0, weighted * 100.0))
    return round(score, 2)


def score_direction(delta: float | None) -> str:
    if delta is None or abs(delta) < 0.01:
        return "flat"
    return "up" if delta > 0 else "down"
