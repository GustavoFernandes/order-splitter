# Change Log

## [Unreleased]
- Fix [#2] - Input fields should validate numeric inputs
- Fix [#45] - Inconsistent 0 values in the hyperlink
- Fix [#47] - Special names break the link
- Fix [#48] - Dollar signs in item names break order splitter

## [0.5.1] - 2017-04-04
- Brought back offline caching [#42]
- Fix [#35] again - Item costs are not rounded
- Fix [#36] - Names with '&' will break calculations from hyperlink

## [0.5.0] - 2017-03-05
- Allow for tip to be entered as both percentage and actual decimal value [#25]
- Temporarily removed offline caching capabilities

### Breaking Changes
- "Tip" in URL query string now represents a fixed monetary amount as opposed to a percentage

## [0.4] - 2017-02-25
- Fix [#23] - Results table does not format correctly
- Fix [#28] - Whitespaces in names are not sanitized in URL
- Fix [#35] - Item costs are not rounded
- Bug fixes to service worker

## [0.3] - 2016-12-05
- Bug fixes to offline caching
- Simplified change log
- Add URL query string input

## [0.2] - 2016-12-01
- Added CHANGELOG file
- Added offline caching
- Improved whitespace detection

## 0.1 - 2016-11-19
- Added initial version

[Unreleased]: https://github.com/GustavoFernandes/order-splitter/compare/v0.5.1...HEAD
[0.5.1]: https://github.com/GustavoFernandes/order-splitter/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/GustavoFernandes/order-splitter/compare/v0.4...v0.5.0
[0.4]: https://github.com/GustavoFernandes/order-splitter/compare/v0.3...v0.4
[0.3]: https://github.com/GustavoFernandes/order-splitter/compare/v0.2...v0.3
[0.2]: https://github.com/GustavoFernandes/order-splitter/compare/v0.1...v0.2
[#2]: https://github.com/GustavoFernandes/order-splitter/issues/2
[#23]: https://github.com/GustavoFernandes/order-splitter/issues/23
[#25]: https://github.com/GustavoFernandes/order-splitter/issues/25
[#28]: https://github.com/GustavoFernandes/order-splitter/issues/28
[#35]: https://github.com/GustavoFernandes/order-splitter/issues/35
[#36]: https://github.com/GustavoFernandes/order-splitter/issues/36
[#42]: https://github.com/GustavoFernandes/order-splitter/issues/42
[#45]: https://github.com/GustavoFernandes/order-splitter/issues/45
[#47]: https://github.com/GustavoFernandes/order-splitter/issues/47
[#48]: https://github.com/GustavoFernandes/order-splitter/issues/48
