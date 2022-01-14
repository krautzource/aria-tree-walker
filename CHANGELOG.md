# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.4.0](https://github.com/krautzource/aria-tree-walker/compare/v3.3.0...v3.4.0) (2022-01-14)


### Features

* dynamically add aria-hidden ([4e5ca41](https://github.com/krautzource/aria-tree-walker/commit/4e5ca41ffcd08f9dfb21e5b1dc8f02eabf987f5a)), closes [#49](https://github.com/krautzource/aria-tree-walker/issues/49)
* **navigator.js:** support optional abortSignal ([af3769c](https://github.com/krautzource/aria-tree-walker/commit/af3769c5c2390de6bdc708ddc70ab64e3391338b)), closes [#41](https://github.com/krautzource/aria-tree-walker/issues/41)


### Bug Fixes

* **package:** add files property ([547189d](https://github.com/krautzource/aria-tree-walker/commit/547189d05ba184dc18dcf2265f72b3db17409442)), closes [#47](https://github.com/krautzource/aria-tree-walker/issues/47)

## [3.3.0](https://github.com/krautzource/aria-tree-walker/compare/v3.2.1...v3.3.0) (2021-06-23)


### Features

* **abstractTree:** support non-anchor links ([24a6321](https://github.com/krautzource/aria-tree-walker/commit/24a6321d18edadc32a295c3782837f999f0559ff)), closes [#665](https://github.com/krautzource/aria-tree-walker/issues/665)

### [3.2.1](https://github.com/krautzource/aria-tree-walker/compare/v3.2.0...v3.2.1) (2021-06-22)


### Bug Fixes

* clear data-activedescendant on highlight(false) ([a27c707](https://github.com/krautzource/aria-tree-walker/commit/a27c707d1f37b9292999310502853670b1cee338)), closes [#43](https://github.com/krautzource/aria-tree-walker/issues/43)

## [3.2.0](https://github.com/krautzource/aria-tree-walker/compare/v3.1.2...v3.2.0) (2021-06-14)


### Features

* track activedescendant in property ([266612c](https://github.com/krautzource/aria-tree-walker/commit/266612c596bcb2bb72c46edf38f70e6f02fefe32)), closes [#42](https://github.com/krautzource/aria-tree-walker/issues/42)

### [3.1.2](https://github.com/krautzource/aria-tree-walker/compare/v3.1.1...v3.1.2) (2021-05-31)

### [3.1.1](https://github.com/krautzource/aria-tree-walker/compare/v3.1.0...v3.1.1) (2021-04-16)


### Bug Fixes

* tolerate bad markup ([9377701](https://github.com/krautzource/aria-tree-walker/commit/9377701742014a5eb4e97fb0fda7bca9b5f09573)), closes [#36](https://github.com/krautzource/aria-tree-walker/issues/36)

## [3.1.0](https://github.com/krautzource/aria-tree-walker/compare/v3.0.1...v3.1.0) (2021-04-12)


### Features

* **navigator:** add subtree highlighting ([bb83ad2](https://github.com/krautzource/aria-tree-walker/commit/bb83ad2b254e17312c4c11010ebf8b648499184d)), closes [#21](https://github.com/krautzource/aria-tree-walker/issues/21)

### [3.0.1](https://github.com/krautzource/aria-tree-walker/compare/v3.0.0...v3.0.1) (2021-03-31)


### Bug Fixes

* **abstractTree:** querySelect from treebase ([90128a8](https://github.com/krautzource/aria-tree-walker/commit/90128a87fec1c6a0615ce012ead7285d8d953043)), closes [#33](https://github.com/krautzource/aria-tree-walker/issues/33)

## [3.0.0](https://github.com/krautzource/aria-tree-walker/compare/v2.0.0...v3.0.0) (2021-03-21)


### ⚠ BREAKING CHANGES

* No longer supports aria-owns+id attributes for tree structure and switches focus management to roving tabindex.

* !feat: Revise data structure and focus management. ([da1f0b6](https://github.com/krautzource/aria-tree-walker/commit/da1f0b6723b78ae731603b773a628255a6066738)), closes [#25](https://github.com/krautzource/aria-tree-walker/issues/25)

## [2.0.0](https://github.com/krautzource/aria-tree-walker/compare/v1.0.0...v2.0.0) (2021-02-27)


### ⚠ BREAKING CHANGES

* package name now scoped.
* remove ./dist
* navigator, attachNavigator now expect (just) DOM node.

### Features

* revise distribution ([b7e763b](https://github.com/krautzource/aria-tree-walker/commit/b7e763b225e584dd620c09829aa6b1758aac4580)), closes [#11](https://github.com/krautzource/aria-tree-walker/issues/11)
* **attachNavigator:** add tabindex ([be28a52](https://github.com/krautzource/aria-tree-walker/commit/be28a52b3756afc9c4afb337da1f606374a27700)), closes [#24](https://github.com/krautzource/aria-tree-walker/issues/24)
* add basic test setup ([c83ad05](https://github.com/krautzource/aria-tree-walker/commit/c83ad05384185f5456bea4c628a1fa63f1c930a7)), closes [#8](https://github.com/krautzource/aria-tree-walker/issues/8)
* remove ./dist ([54d5384](https://github.com/krautzource/aria-tree-walker/commit/54d5384dedd8bfaa1a3e6503587dc6ac56fbc759)), closes [#9](https://github.com/krautzource/aria-tree-walker/issues/9)
* revise module structure and base API ([d0fd65e](https://github.com/krautzource/aria-tree-walker/commit/d0fd65ef4c35b387f2bedb06fec1b7875f6b1f38)), closes [#5](https://github.com/krautzource/aria-tree-walker/issues/5)
* support anchors ([85f4d75](https://github.com/krautzource/aria-tree-walker/commit/85f4d7526c738d7247a66afa39cd5e8d918a3153)), closes [#22](https://github.com/krautzource/aria-tree-walker/issues/22)


### Bug Fixes

* handle (some) bad trees ([1ab937e](https://github.com/krautzource/aria-tree-walker/commit/1ab937ecd5309e704e848d2f0cdda8bbd989bfd2)), closes [#18](https://github.com/krautzource/aria-tree-walker/issues/18)
* **generateDocs:** update wording ([5653260](https://github.com/krautzource/aria-tree-walker/commit/565326055b50c54dde51f0c6552ac8e0837fba73)), closes [#7](https://github.com/krautzource/aria-tree-walker/issues/7)


* feat!(package.json): add scope to name ([c36f966](https://github.com/krautzource/aria-tree-walker/commit/c36f9666f5f658f22d2797f534035b8ca4aa063d)), closes [#11](https://github.com/krautzource/aria-tree-walker/issues/11)

## 1.0.0 (2020-06-01)


### Features

* add standard-version ([3bb53e6](https://github.com/krautzource/aria-tree-walker/commit/3bb53e6cf5dfdb507a83567801721f50a0ee9aa9)), closes [#6](https://github.com/krautzource/aria-tree-walker/issues/6)
* complete the fork ([0a07c13](https://github.com/krautzource/aria-tree-walker/commit/0a07c136f8184da6a07a9704420355d3ead6baeb)), closes [#1](https://github.com/krautzource/aria-tree-walker/issues/1) [#2](https://github.com/krautzource/aria-tree-walker/issues/2)
* migrate krautzource/mathjax-sre-walker ([0736106](https://github.com/krautzource/aria-tree-walker/commit/073610638fd5273eca007a6cdcaf812709944432))


### Bug Fixes

* **docs:** fix aspirin highlighting ([f13ac5b](https://github.com/krautzource/aria-tree-walker/commit/f13ac5be86491b5bf3770ab8be7c7b4f7d4ece9d)), closes [#4](https://github.com/krautzource/aria-tree-walker/issues/4)
