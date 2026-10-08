"""Normalization of the demo block's optional text fields."""

import pytest

from plone.blicca.block.blocks.demo_block.data import text


@pytest.mark.parametrize("value", [None, 0, 42, False, True, [], {}])
def test_non_string_values_are_empty(value):
    assert text(value) == ""


@pytest.mark.parametrize(
    "value,expected",
    [("", ""), (" \t\n", ""), ("  Plone  ", "Plone"), (" A\nB ", "A\nB")],
)
def test_text_trims_only_surrounding_whitespace(value, expected):
    assert text(value) == expected
