# plone.blicca.block

Demo block for the Aurora editor.

The package includes a React editor and view, a Python server renderer, Plone
installation and uninstall profiles, scoped CSS, and tests for both renderers.

## Install in Plone

Install `plone.blicca.block` alongside
[plone.blicca.auroraeditor](https://github.com/derico-de/plone.blicca.auroraeditor)
in your Plone environment. Include `plone.blicca.block` in ZCML if your setup
does not use automatic inclusion, then activate **Plone Blicca Block** in the
Add-ons control panel (GenericSetup profile `plone.blicca.block:default`).
