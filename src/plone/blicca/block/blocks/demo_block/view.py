import re

from plone.blicca.auroraeditor.rendering import BaseBlockView

from plone.blicca.block.blocks.demo_block import data

#: Template indentation, between two tags. Collapsed away — see ``__call__``.
_INDENT = re.compile(r">\s+<")


class View(BaseBlockView):
    @property
    def demo(self):
        return self.data or {}

    @property
    def available(self):
        return bool(self.title or self.description)

    @property
    def title(self):
        return data.text(self.demo.get("title"))

    @property
    def description(self):
        return data.text(self.demo.get("description"))

    def __call__(self):
        """The template's markup, with its own indentation collapsed away.

        NO WHITESPACE-ONLY TEXT NODES, on either surface. JSX drops
        inter-element whitespace by construction; a readable ZPT template does
        not, and an inter-element newline is a real space in an inline
        formatting context — so one sheet dressing both surfaces would meet
        gaps on one and not the other. It also matters inside the Plate
        editable, which computes ``white-space: pre-wrap`` and turns every such
        newline into a line box.

        Collapsing ``>\\s+<`` is sound rather than approximate, on two
        invariants this module holds: every text value goes through
        ``data.text``, so no text node begins or ends with whitespace,
        and Chameleon escapes every value, so the only bare ``<`` and ``>`` in
        the output are structural. The alternative — hanging the template's
        brackets inside the start tags — buys the same output and costs the
        readability that keeps this template comparable to ``View.tsx``.
        """
        return _INDENT.sub("><", self.index().strip())
