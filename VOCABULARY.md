# Vocabulary

Interface copy uses only these words for the things on this site. Your own
prose in entries and on the about page is yours; these rules are for labels,
links, headings and anything a component prints.

| Word | Means |
| --- | --- |
| seed | a project. The word "project" does not appear in the interface. |
| notebook | the collection of writing |
| entry | one piece of writing in the notebook, about exactly one seed |
| map | the home page: the star map |
| light | any mark on the map, seed or entry |
| growing | a seed that is planted and under way |
| not yet planted | a seed that exists as a promise, not yet started |
| bearing | a seed that has shipped and has results |
| written / unwritten | an entry's two states |
| gardener | the owner. The about page is "About the gardener". |

Not used in interface copy: project, blog, post, article, case study, portfolio, work (as a noun for seeds).

## Checking it

After a build, run:

```sh
npm run check:words
```

It searches the built pages for the banned words and prints each hit. Hits in
your own prose (for example the home page's "which is what I call a project")
are allowed; it lists them so the choice stays deliberate.
