import sys
import json
from scholarly import scholarly

def checkResearcher(name):
    search_query = scholarly.search_author(name)
    author = next(search_query, None)
    if not author:
        return {"name": name, "error": "No researchers found."}
    
    author = scholarly.fill(author)
    details = {
        "name": author.get('name'),
        "affiliation": author.get('affiliation'),
        "email": author.get('email_domain'),
        "scholar_id": author.get('scholar_id'),
        "publications": [
            {
                "bib": {
                    "title": pub.get('bib', {}).get('title'),
                    "pub_year": pub.get('bib', {}).get('pub_year'),
                    "citation": pub.get('bib', {}).get('citation')
                }
            } for pub in author.get('publications')[:5] if pub.get('bib')
        ] if author.get('publications') else "No publications found."
    }

    # Check if Author is Affiliated with Sheffield Hallam University or Email: ending with shu.ac.uk
    if "Sheffield Hallam University" in details['affiliation'] or details['email'].endswith("shu.ac.uk"):
        return details
    else:
        return {"name": details['name'], "error": "Researcher is not affiliated with Sheffield Hallam University."}

def readCSV():
    filename = "staff_name.csv"
    name = []
    with open(filename, 'r') as file:
        for line in file:
            name.append(line.strip())

    staff_affiliation = []
    for n in name[:5]:
        details = checkResearcher(n)
        if "error" in details:
            print(details)
        else:
            staff_affiliation.append(details)

    with open("staff_affiliation.json", 'w') as file:
        json.dump(staff_affiliation, file, indent=4)

readCSV()