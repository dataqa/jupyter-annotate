# jupyterannotate

![Build Status](https://github.com/dataqa/jupyter-annotate/actions/workflows/build.yml/badge.svg?branch=main)

Interactive Text Annotation for Jupyter Notebook/Lab

![Jupyter Annotate](examples/images/Annotate_1.png?raw=true "Jupyter Annotate")

* Perform entity extraction inline without leaving your notebook.
* Iteratively label and train a model in the same environment.
* Iterate over the label schema faster.
* Quickly inspect the quality of pre-annotation tools such as skweak or spacy.

## Installation

You can install using `pip`:

```bash
pip install jupyterannotate
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:

```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] jupyterannotate
```

## Usage

See [Example](examples/introduction.ipynb)

Within an Jupyter Notebook cell:

```
# Define some labels
LABELS = ["Organization", "Product", "Person", "Country", "Date", "Quantity"]

# Define some documents
DOCUMENTS = [
    "Oracle introduced a...",
    "Microsoft will delay the ...",
]

# Instantiate widget
# Optionally specify a list of spans to prepopulate
annotation_widget = jupyterannotate.AnnotateWidget(
    docs=NEWS_HEADLINES,
    labels=LABELS,
    spans=[
      [
        {'start': 0, 'end': 6, 'text': 'Oracle', 'label': 'Organization'},
      ],
      []
    ]
)

# Render
annotation_widget
```

![Apply Label](examples/images/Annotate_1.gif?raw=true "Apply Label")

- Choose label
- Select text within displayed document
- Click on existing span to remove
- Navigate documents using top-right

```
# Access spans - a List containing a List of Spans per document
# e.g. [[{'start': 0, 'end': 6, 'text': 'Oracle', 'label': 'Organization'}], []]
annotation_widget.spans


# See updates in real-time
annotation_widget.spans = [
    [
        {'start': 0, 'end': 6, 'text': 'Oracle', 'label': 'Organization'},
        {'start': 69, 'end': 72, 'text': '10g', 'label': 'Quantity'}
    ],
    []
]
```

![Update Python](examples/images/Annotate_2.gif?raw=true "Update Python")

## Development Installation

Create a dev environment:

```bash
conda create -n jupyterannotate-dev -c conda-forge nodejs yarn python jupyterlab
conda activate jupyterannotate-dev
```

Install the python. This will also build the TS package.

```bash
pip install -e ".[test, examples]"
```

When developing your extensions, you need to manually enable your extensions with the
notebook / lab frontend. For lab, this is done by the command:

```
jupyter labextension develop --overwrite .
yarn run build
```

For classic notebook, you need to run:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py jupyterannotate
jupyter nbextension enable --sys-prefix --py jupyterannotate
```

Note that the `--symlink` flag doesn't work on Windows, so you will here have to run
the `install` command every time that you rebuild your extension. For certain installations
you might also need another flag instead of `--sys-prefix`, but we won't cover the meaning
of those flags here.

### How to see your changes

#### Typescript:

If you use JupyterLab to develop then you can watch the source directory and run JupyterLab at the same time in different
terminals to watch for changes in the extension's source and automatically rebuild the widget.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
yarn run watch
# Run JupyterLab in another terminal
jupyter lab
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

#### Python:

If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.
