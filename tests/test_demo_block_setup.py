"""Test plone.blicca.block installation."""

from .utils import block_addon_records
from plone import api
from plone.app.testing import TEST_USER_ID
from plone.app.testing import setRoles
from plone.blicca.auroraeditor import blockaddons

import pytest


#: The record's name under the add-on prefix, and the resource directory
#: `configure.zcml` publishes. Spelled here so a rename shows up as a failing
#: test rather than as a block that silently stops appearing.
RECORD_NAME = "plone.blicca.block.demo-block"
RESOURCE = "++plone++plone.blicca.block"


class TestSetup:
    """Test installation and setup."""

    @pytest.fixture(autouse=True)
    def _setup(self, integration):
        self.portal = integration["portal"]

    def test_blockaddon_record_installed(self):
        """One record, spelled exactly as the committed artifacts are."""
        record = block_addon_records()[RECORD_NAME]
        assert record.bundle == f"{RESOURCE}/demo-block.js"
        assert record.css == f"{RESOURCE}/demo-block.css"
        assert record.types == ["demo-block"]
        assert record.enabled
        assert record.weight == 100

    def test_blockaddon_record_declares_insert_permission(self):
        """Insertion uses the permission declared by this addon."""
        record = block_addon_records()[RECORD_NAME]
        assert record.permission == "plone.blicca.block: Insert Block"

    def test_addon_loadable_by_wrapper(self):
        """The wrapper's discovery gates accept the add-on.

        The discovery chain requires the record to be present and the bundle to
        resolve as a ``++plone++`` resource. A failure here is the difference
        between a block in the slash menu and no block at all.
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

    def test_blockaddon_record_removed(self):
        """Uninstall removes the record, in lockstep with the browser layer.

        An orphaned record would keep the editor loading a bundle whose server
        renderer is gone: the block would still be insertable on a site that
        publishes it as `block-unrendered`.
        """
        assert RECORD_NAME not in block_addon_records()
