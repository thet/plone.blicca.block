"""Test plone.blicca.block installation."""

from plone import api
from plone.app.testing import TEST_USER_ID
from plone.app.testing import setRoles
from plone.blicca.block.interfaces import IBrowserLayer

import pytest


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

    def test_browserlayer_removed(self):
        """Uninstall removes the browser layer."""
        from plone.browserlayer import utils

        assert IBrowserLayer not in utils.registered_layers()
