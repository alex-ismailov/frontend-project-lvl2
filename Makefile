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
	npx -n --experimental-vm-modules jest .

test-watch:
	npx -n --experimental-vm-modules jest --watchAll .
