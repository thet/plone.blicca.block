"""Public rendering uses the same anatomy fixtures as the React view."""

from .utils import assert_html_equal
from pathlib import Path
from plone.blicca.auroraeditor.browser.rendering.base import BlockDispatchMixin
from plone.blicca.block.interfaces import IBrowserLayer
from zope.component import getMultiAdapter
from zope.interface import alsoProvides
from zope.publisher.browser import TestRequest as BrowserRequest

import json
import pytest


BLOCK_TYPE = "demo-block"
FIXTURE = Path(__file__).with_name("demo-block-anatomy-cases.json")
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
    assert_html_equal(view(), case["html"])


def test_missing_data(view):
    assert_html_equal(view(), '<div class="demo-block"></div>')
    assert not view.available


def test_dispatcher_finds_demo_block(integration, block_request):
    dispatcher = BlockDispatchMixin()
    dispatcher.context = integration["portal"]
    dispatcher.request = block_request
    assert_html_equal(
        dispatcher.render_block_data({"@type": BLOCK_TYPE, "title": "Plone"}),
        '<div class="demo-block"><div class="demo-block-copy">'
        '<h2 class="demo-block-title">Plone</h2></div></div>',
    )
