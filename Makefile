i:
	npm install

publish:
	npm publish --dry-run

logs:
	git log --oneline --decorate --graph --all

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

test:
	npm test

test-watch:
	npx -n --experimental-vm-modules jest --watchAll .

test-coverage:
	npm test -- --coverage --coverageProvider=v8
