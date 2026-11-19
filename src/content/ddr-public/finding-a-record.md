# Finding a record in the archive

This guide shows how to use a prepared example to find documents associated with an archival record. It follows the **Design Education Unit | DEU** example demonstrated in the DDR Digital Archive.

You do not need to write or understand computer code. The archive provides a ready-made request.

## What you will learn

You will learn how to:

- Find a prepared example for an archive record.
- Open the example in the GraphQL sandbox.
- Run the prepared request.
- Read the results, including document titles and descriptive information.
- Open a linked archival document.

## Before you begin

Sign in to the [DDR Digital Archive](https://ddrarchive.org) and open **API** from the main navigation.

If you have not used this area before, read [Getting started](/ddr-public/getting-started) first.

## Find a prepared archive-record example

1. On the **DDR API landing** page, select **Presets and snippets**.
2. Scroll to the **Archive records** section.
3. Find the card labelled **Design Education Unit | DEU**.
4. Select that card to load the prepared example.

![Archive records cards including Design Education Unit | DEU](/images/ddr-public/02-01-deu-preset.png "Archive records cards under Presets and snippets, showing the Design Education Unit | DEU card.")

**What happens next?** The example opens in the **GraphQL sandbox**, with **Design Education Unit | DEU** selected under **Archive records**.

## Run the prepared request

1. In the **GraphQL sandbox**, locate the **Query editor** on the left.
2. Check that **Design Education Unit | DEU** appears in the **Archive records** selection.
3. Select **Run query**.

You do not need to change the text displayed in the **GRAPHQL QUERY** area.

![GraphQL sandbox with Design Education Unit selected, Run query button and empty Response area](/images/ddr-public/02-02-sandbox-before.png "GraphQL sandbox before running the request, showing the Archive records selection, Run query button and empty Response area.")

**What happens next?** The **Response** area on the right displays the information returned for the selected record.

![GraphQL sandbox with query controls and returned document cards](/images/ddr-public/02-03-sandbox-results.png "GraphQL sandbox after Run query, showing the response as document cards alongside the query controls.")

## Explore the returned documents

The response includes document cards showing information such as:

- A preview image of the document.
- The document title.
- An asset identifier, labelled **Asset PID**.
- Descriptive keywords.
- Rights and attribution information, where provided.
- A **View document** link.

An **Asset PID** is an identifier used to distinguish one digital asset from another.

Scroll through the document cards to explore the material associated with the selected archive record.

The number and order of returned documents may change as the archive develops.

![Returned document card with thumbnail, title, Asset PID, keywords, rights information and View document link](/images/ddr-public/02-04-document-card.png "A returned document card showing its thumbnail, title, Asset PID, keywords, rights information and View document link.")

## Open a document

1. Choose a document card that interests you.
2. Select **View document** at the bottom of the card.

![Document card showing its title and View document link](/images/ddr-public/02-05-view-document.png "The lower portion of a document card showing the View document link.")

**What happens next?** The document opens in a separate browser tab, using the browser's PDF viewer.

![Archival document open in a browser PDF viewer](/images/ddr-public/02-06-opened-document.png "The opened archival PDF.")

You can read the document using the PDF viewer's controls. Return to the DDR Digital Archive tab to explore further results.

## Understanding the results

The results bring together digitised documents and descriptive information associated with the selected archive record. They are a starting point for further investigation, not necessarily a complete representation of the surviving historical material.

Some records may have more digitised documents or descriptive information than others. An absent document or incomplete description does not necessarily mean that the historical material never existed.

## Troubleshooting

### I cannot find the Design Education Unit example

Check that you have selected **API**, followed by **Presets and snippets**. Scroll to **Archive records** and look for **Design Education Unit | DEU**.

### The sandbox shows no results

Check that the intended archive-record example is selected, then select **Run query**. Allow the response a moment to load.

### I can see technical-looking text

The **GRAPHQL QUERY** panel contains the prepared request. You do not need to edit it. Focus on the **Response** area after selecting **Run query**.

### A document does not open

Check whether your browser has opened another tab. If it has not, try selecting **View document** again. If the problem persists, note which document you attempted to open and any error message.

## Related information

- [Getting started](/ddr-public/getting-started)
