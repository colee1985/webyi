{WorkspaceView} = require 'atom'
AtomCoWebyi = require '../lib/atom-co-webyi'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "AtomCoWebyi", ->
  activationPromise = null

  beforeEach ->
    atom.workspaceView = new WorkspaceView
    activationPromise = atom.packages.activatePackage('atom-co-webyi')

  describe "when the atom-co-webyi:toggle event is triggered", ->
    it "attaches and then detaches the view", ->
      expect(atom.workspaceView.find('.atom-co-webyi')).not.toExist()

      # This is an activation event, triggering it will cause the package to be
      # activated.
      atom.workspaceView.trigger 'atom-co-webyi:toggle'

      waitsForPromise ->
        activationPromise

      runs ->
        expect(atom.workspaceView.find('.atom-co-webyi')).toExist()
        atom.workspaceView.trigger 'atom-co-webyi:toggle'
        expect(atom.workspaceView.find('.atom-co-webyi')).not.toExist()
