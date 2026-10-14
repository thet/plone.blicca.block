from doctest import Example
from lxml.doctestcompare import LHTMLOutputChecker
from plone.blicca.auroraeditor import blockaddons
from plone.blicca.auroraeditor.interfaces import IAuroraBlockAddon
from plone.registry.interfaces import IRegistry
from zope.component import getUtility


def block_addon_records():
    """The site's IAuroraBlockAddon collection, keyed by record name."""
    registry = getUtility(IRegistry)
    return registry.collectionOfInterface(
        IAuroraBlockAddon,
        prefix=blockaddons.BLOCKADDON_PREFIX,
        check=False,
    )


def assert_html_equal(actual, expected):
    """Compare one HTML snippet with another, removing any formatting inconsistencies."""
    checker = LHTMLOutputChecker()
    assert checker.check_output(expected, actual, 0), checker.output_difference(
        Example("", expected), actual, 0
    )
