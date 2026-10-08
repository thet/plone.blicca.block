"""Public rendering uses the same anatomy fixtures as the React view."""

import json
from pathlib import Path

import pytest
from plone.blicca.auroraeditor.browser.rendering.base import BlockDispatchMixin
from zope.component import getMultiAdapter
from zope.interface import alsoProvides
from zope.publisher.browser import TestRequest as BrowserRequest

from plone.blicca.block.interfaces import IBrowserLayer

BLOCK_TYPE = "demo-block"
FIXTURE = Path(__file__).with_name("anatomy-cases.json")
CASES = json.loads(FIXTURE.read_text(encoding="utf-8"))["cases"]
VIEW_NAME = f"aurora-block-{BLOCK_TYPE}"


@pytest.fixture
def block_request():
    request = BrowserRequest()
    alsoProvides(request, IBrowserLayer)
    return request


@pytest.fixture
def view(integration, block_request):
    return getMultiAdapter((integration["portal"], block_request), name=VIEW_NAME)


@pytest.mark.parametrize("case", CASES, ids=lambda case: case["name"])
def test_shared_anatomy(view, case):
    view.data = {"@type": BLOCK_TYPE, **case["data"]}
    assert view() == case["html"]


def test_missing_data(view):
    assert view() == '<div class="demo-block"></div>'
    assert not view.available


def test_dispatcher_finds_demo_block(integration, block_request):
    dispatcher = BlockDispatchMixin()
    dispatcher.context = integration["portal"]
    dispatcher.request = block_request
    assert dispatcher.render_block_data({"@type": BLOCK_TYPE, "title": "Plone"}) == (
        '<div class="demo-block"><div class="demo-block-copy">'
        '<h2 class="demo-block-title">Plone</h2></div></div>'
    )
