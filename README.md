# Smart Search for Research Expert Connections

### Overview

Imagine a platform that instantly connects Sheffield Hallam researchers with ideal collaborators. Smart Search uses AI to analyze staff expertise and makes project work easy with secure collaboration tools. Researchers can find the most relevant research through advanced semantic search, encouraging meaningful partnerships. This project boosts innovation by helping researchers connect and work together efficiently, enabling them to achieve great things together.

### Features

- **Expert Connections:** Seamlessly connect researchers with relevant experts for collaboration.
- **Research Collaboration Tools:** Tools for project collaboration, resource sharing, and effective communication.
- **Accurate Matchmaking:** Algorithms for precise expert recommendations based on detailed research profiles.
- **Automated Profile Updates:** Integration with academic databases for automatic, comprehensive, and current user profile updates.
- **Data Privacy and Security:** Robust measures to protect user information and ensure data protection compliance.
- **AI Recommendations:** Personalized recommendations for potential collaborators using AI techniques.

### Technical skills

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MySQL, MongoDB
- **AI/ML:** Python (AI/ML Libraries)
- **API:** RESTfull

## Getting Started

#### Prerequisites

- Cloud Storage
- Cloud Computing
- Google Colab
- Server for data training

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/smart-search.git
   cd smart-search
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file and add your environment variables:
   ```plaintext
   DB_CONNECTION_STRING=your_database_connection_string
   API_KEY=your_api_key
   ```

4. Start the server:
   ```bash
   yarn start
   ```

### Project Structure

```plaintext
smart-search/
├── public/             
├── src/                
│   ├── api/            
│   │   └── search.js   
│   ├── config/         
│   │   └── database.js 
│   ├── controllers/    
│   │   └── searchController.js
│   ├── models/         
│   │   └── Research.js
│   ├── services/       
│   │   ├── llmService.js
│   │   └── synonymService.js
│   ├── utils/          
│   │   └── helpers.js
│   ├── app.js          
│   └── server.js       
├── test/               
│   └── search.test.js  
├── .env                
├── .gitignore          
├── package.json        
├── README.md           
└── yarn.lock           
```

### Usage

1. **Search Experts:** Use the search functionality to find experts based on research content and citation metrics.
2. **View Profiles:** Access detailed user profiles with integration to Google Scholar and ResearchGate.
3. **Collaborate:** Utilize built-in tools for project collaboration and resource sharing.
4. **Recommendations:** Receive personalized recommendations for potential collaborators.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please contact our team at [email@example.com](mailto:email@example.com).

---

## Group Members

| Name                        | Student Number | Role                                  |
|-----------------------------|----------------|---------------------------------------|
| Smit Merchant               | 33078761       | Quality Assurance                     |
| Brijbhan Govardhan Prajapati| 33084787       | Front-End Developer                   |
| Ankit Kumar Ganesh Singh    | 33085894       | UI Developer                          |
| Akshay Darji                | 33076764       | Scrum Master and Project Manager      |
| Aman Upadhyay               | 33076791       | Team Leader and Full-Stack Developer  |

## Acknowledgments

Special thanks to our module leader, Dr. Maria Luisa Davila Garcia, for her guidance and support throughout this project.
