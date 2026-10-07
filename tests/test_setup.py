"""Test plone.blicca.block installation.

The install profile is what makes the committed bundle reachable at all: the
JS can be perfect and the block still never appears, because ``@@aurora-edit``
discovers add-ons per site through an ``IAuroraBlockAddon`` record and gates
each one on *enabled*, *bundle resolves* and *block-api compatible*. Every
gate is asserted here rather than assumed, and uninstall is asserted to undo
exactly what install did — a record outliving its browser layer would keep the
block in the slash menu of a site that can no longer render it.
"""

import pytest
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from plone.blicca.auroraeditor import blockaddons
from plone.blicca.auroraeditor.interfaces import IAuroraBlockAddon
from plone.registry.interfaces import IRegistry
from zope.component import getUtility

from plone import api
from plone.blicca.block.blocks import DEMO_BLOCK_TYPE
from plone.blicca.block.interfaces import IBrowserLayer


#: The record's name under the add-on prefix, and the resource directory
#: `configure.zcml` publishes. Spelled here so a rename shows up as a failing
#: test rather than as a block that silently stops appearing.
RECORD_NAME = "plone.blicca.block.demo-block"
RESOURCE = "++plone++plone.blicca.block"


def block_addon_records():
    """The site's IAuroraBlockAddon collection, keyed by record name."""
    registry = getUtility(IRegistry)
    return registry.collectionOfInterface(
        IAuroraBlockAddon,
        prefix=blockaddons.BLOCKADDON_PREFIX,
        check=False,
    )


class TestSetup:
    """Test installation and setup."""

    @pytest.fixture(autouse=True)
    def _setup(self, integration):
        self.portal = integration["portal"]

    def test_addon_installed(self):
        """Test addon is installed."""
        installer = api.addon.get_installer(self.portal)
        assert installer.is_product_installed("plone.blicca.block")

    def test_browserlayer(self):
        """Test browserlayer is registered."""
        from plone.browserlayer import utils

        assert IBrowserLayer in utils.registered_layers()

    def test_blockaddon_record_installed(self):
        """One record, spelled exactly as the committed artifacts are."""
        record = block_addon_records()[RECORD_NAME]
        assert record.bundle == f"{RESOURCE}/demo-block.js"
        assert record.css == f"{RESOURCE}/demo-block.css"
        assert record.types == [DEMO_BLOCK_TYPE]
        assert record.enabled
        assert record.weight == 100

    def test_blockaddon_record_declares_the_api_floor(self):
        """`block_api` is the floor the bundle needs, not the host's version.

        Declaring the host's current version would strand this block on the
        next host bump, and a mismatch is a fail-soft skip: the block vanishes
        from the slash menu without erroring.
        """
        record = block_addon_records()[RECORD_NAME]
        assert record.block_api == "1.0"
        host = blockaddons.host_block_api()
        assert blockaddons.is_compatible(record.block_api, host)

    def test_blockaddon_record_declares_insert_permission(self):
        """Insertion uses the permission declared by this addon."""
        record = block_addon_records()[RECORD_NAME]
        assert record.permission == "plone.blicca.block: Insert Block"

    def test_addon_loadable_by_wrapper(self):
        """The wrapper's discovery gates accept the add-on.

        The discovery chain requires the record to be present, the bundle to
        resolve as a ``++plone++`` resource, and a compatible block-api. A failure
        here is the difference between a block in the slash menu and no block
        at all.
        """
        statuses = {s.name: s for s in blockaddons.evaluate(self.portal)}
        status = statuses[RECORD_NAME]
        assert status.skip_reason is None
        assert status.loadable
        assert status.bundle_url
        assert status.css_url


class TestUninstall:
    """Test uninstallation."""

    @pytest.fixture(autouse=True)
    def _setup(self, integration):
        self.portal = integration["portal"]
        setRoles(self.portal, TEST_USER_ID, ["Manager"])
        self.installer = api.addon.get_installer(self.portal)
        self.installer.uninstall_product("plone.blicca.block")

    def test_addon_uninstalled(self):
        """Test addon is uninstalled."""
        assert not self.installer.is_product_installed("plone.blicca.block")

    def test_blockaddon_record_removed(self):
        """Uninstall removes the record, in lockstep with the browser layer.

        An orphaned record would keep the editor loading a bundle whose server
        renderer is gone: the block would still be insertable on a site that
        publishes it as `block-unrendered`.
        """
        assert RECORD_NAME not in block_addon_records()

    def test_browserlayer_removed(self):
        """Uninstall removes the browser layer."""
        from plone.browserlayer import utils

        assert IBrowserLayer not in utils.registered_layers()
