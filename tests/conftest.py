from pytest_plone import fixtures_factory

from plone.blicca.block.testing import FUNCTIONAL_TESTING
from plone.blicca.block.testing import INTEGRATION_TESTING


globals().update(
    fixtures_factory((
        (INTEGRATION_TESTING, "integration"),
        (FUNCTIONAL_TESTING, "functional"),
    ))
)
