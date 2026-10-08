"""Reading the Demo block's stored JSON — the Python twin of ``demo-block/data.ts``."""


def text(value):
    return value.strip() if isinstance(value, str) else ""
