document.addEventListener('DOMContentLoaded', function() {
    // Funzione per creare l'effetto particellare nell'header
    function createParticles() {
        const header = document.querySelector('.header');
        for (let i = 0; i < 50; i++) {
            // Crea un nuovo elemento div per ogni particella
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Genera dimensione casuale per la particella
            const size = Math.random() * 8 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Posiziona la particella in modo casuale nell'header
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Imposta un'opacità casuale per un effetto più naturale
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // Animazione per il movimento delle particelle
            const duration = Math.random() * 30 + 10;
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            // Imposta l'animazione CSS inline
            particle.style.animation = `float ${duration}s infinite ${direction < 0 ? 'alternate' : ''} ease-in-out`;
            particle.style.transform = `translateY(0)`;
            
            // Aggiunge la particella all'header
            header.appendChild(particle);
        }
    }
    
    // Crea le particelle quando la pagina è completamente caricata
    createParticles();
    
    // Toggle tema chiaro/scuro
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        // Alterna la classe dark-mode sul body
        document.body.classList.toggle('dark-mode');
        
        // Cambia l'icona del pulsante in base al tema
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌓';
    });
    
    // Implementazione dello scroll fluido tra le sezioni
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ottieni l'elemento di destinazione dall'attributo href
            const target = document.querySelector(this.getAttribute('href'));
            
            // Calcola la posizione di destinazione tenendo conto dell'altezza della navbar
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            // Effettua lo scroll con animazione fluida
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Effetto parallasse per lo sfondo (gestito principalmente da CSS)
    window.addEventListener('scroll', function() {
        // La velocità del parallasse può essere regolata cambiando il divisore
        const scrolled = window.pageYOffset;
        const parallaxSpeed = scrolled / 5;
        
        // Applica la trasformazione agli elementi che vuoi influenzare
        document.querySelectorAll('.section').forEach((section, index) => {
            // Ogni sezione ha un leggero ritardo diverso
            const delay = index * 0.1;
            section.style.transform = `translateY(${parallaxSpeed * delay}px)`;
        });
    });

    // Animazione typewriter
    const nameElement = document.querySelector('.name');
    nameElement.style.width = '0';

    setTimeout(function() {
    nameElement.style.width = '100%';
    });

    // PDF Generation using direct jsPDF methods
    const downloadBtn = document.querySelector('.download-btn');
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Change button text to indicate generation is in progress
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Generazione PDF...';
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Define page dimensions and margins
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        
        // Set up styles
        const primaryColor = [44, 62, 80];   // #2c3e50
        const secondaryColor = [52, 152, 219]; // #3498db
        
        // Add header
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // Add name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("Raffaele Cannarsa", margin, 25);
        
        // Add subtitle
        doc.setFontSize(12);
        doc.text("Laureato in Statistica, professionista analitico ed empatico", margin, 32);
        
        // Add contact info
        doc.setFontSize(10);
        doc.text("phone: +39 346 029 7959", margin, 40);
        doc.text("email: cannarsa.raffaele.01@gmail.com", margin + 60, 40);
        
        // Current vertical position
        let y = 55;
        
        // Helper function to add section with title
        function addSection(title, content) {
            // Check if we need a new page
            if (y > pageHeight - 50) {
                doc.addPage();
                y = margin;
            }
            
            // Add section title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(title, margin, y);
            
            // Add underline
            doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, y + 1, margin + 30, y + 1);
            
            y += 8;
            
            // Add content
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            // Handle content as array of paragraphs or lines
            if (Array.isArray(content)) {
                content.forEach(item => {
                    // Check for possible item structure (for timeline items)
                    if (typeof item === 'object' && item.date && item.title && item.description) {
                        // Format timeline item
                        doc.setFont('helvetica', 'bold');
                        doc.text(`${item.date}`, margin, y);
                        doc.text(`${item.title}`, margin + 30, y);
                        y += 5;
                        doc.setFont('helvetica', 'normal');
                        
                        // Handle multi-line description with text wrapping
                        const splitDescription = doc.splitTextToSize(item.description, pageWidth - (2 * margin) - 30);
                        doc.text(splitDescription, margin + 30, y);
                        y += (splitDescription.length * 5) + 5;
                    } else {
                        // Regular text with wrapping
                        const splitText = doc.splitTextToSize(item, pageWidth - (2 * margin));
                        doc.text(splitText, margin, y);
                        y += (splitText.length * 5) + 5;
                    }
                });
            } else {
                // Handle single string with text wrapping
                const splitText = doc.splitTextToSize(content, pageWidth - (2 * margin));
                doc.text(splitText, margin, y);
                y += (splitText.length * 5) + 10;
            }
        }
        
        // Add Profile section
        const profileText = "Laureato in Statistica, sono un professionista altamente preciso ed empatico. La mia formazione accademica mi ha dotato di solide competenze analitiche e di problem solving, mentre la mia natura empatica mi consente di comprendere appieno le esigenze degli altri. Capacità di lavorare sia in autonomia che in team, con attenzione ai dettagli e flessibilità per adattarmi a diversi contesti lavorativi.";
        addSection("Profilo", profileText);
        
        // Add Education section
        const educationItems = [
            {
                date: "2019 - 2023",
                title: "Università di Roma La Sapienza",
                description: "Laurea in Statistica, Economia e Finanza"
            },
            {
                date: "2014 - 2019",
                title: "Liceo Scientifico Nomentano",
                description: "Diploma di scuola superiore"
            },
            {
                date: "2011 - 2020",
                title: "British School Group",
                description: "Studio della lingua inglese con insegnati madrelingua, certificati fino al Proficiency"
            }
        ];
        addSection("Formazione Accademica", educationItems);
        
        // Add Work Experience section
        const experienceItems = [
            {
                date: "2024",
                title: "Decathlon",
                description: "Assistenza alle vendite, gestione della merce in arrivo e iniziative sulla riorganizzazione generale degli spazi per mettere in risalto determinati prodotti."
            },
            {
                date: "2018",
                title: "Vitha Group",
                description: "Come addetto alle vendite, ho fissato appuntamenti, effettuato colloqui di presentazione dei prodotti, predisposto la documentazione amministrativa relativa alla vendita."
            },
            {
                date: "2018",
                title: "Stage Linguistico a Dublino (ASL)",
                description: "Ideazione di sondaggi da sottoporre ai locali tramite interviste svolte in inglese e simulazione di campagne pubblicitarie."
            },
            {
                date: "2016 - 2017",
                title: "Progetto \"MARINA\" del CNR (ASL)",
                description: "Produzione di video per sensibilizzare la popolazione riguardo ai problemi ambientali, utilizzo di questionari e interviste per indagare il livello di conoscenza generale e partecipazione ad un World Café."
            },
            {
                date: "2017",
                title: "International Chess Festival (ASL)",
                description: "Allestimento e sorveglianza delle sale da gioco. Promozione e vendita della merce sponsorizzata dall'evento. Info point e relazioni con il pubblico internazionale."
            }
        ];
        addSection("Esperienze Lavorative", experienceItems);
        
        // Add Skills section
        const skillsText = [
            "Lingue: Italiano (Madrelingua), Inglese (Proficiency).",
            "Capacità Professionali: Analisi Statistica, Problem Solving, Lavoro in Team.",
            "Competenze Statistiche: RStudio (Avanzato), SAS (Intermedio), MySQL (Intermedio).",
            "Competenze Informatiche: C (Avanzato), HTML/CSS (Intermedio), PHP (Intermedio), JavaScript (Base)."
        ];
        addSection("Competenze", skillsText);
        
        // Add Projects section
        const projectsText = [
            "Libft: Creazione da zero di una libreria C robusta con oltre 40 funzioni essenziali, padroneggiando gestione della memoria e strutture dati fondamentali.",
            "ft_printf: Ricostruzione completa della funzione printf() di C, implementando un sofisticato sistema di parsing e gestione di formati di output con precisione millimetrica.",
            "get_next_line: Algoritmo avanzato per la lettura ottimizzata di file che bilancia perfettamente efficienza e gestione della memoria, anche con file di dimensioni massive.",
            "born_2_be_root: Architettura e configurazione di un sistema Linux enterprise-grade con hardening avanzato, implementando protocolli di sicurezza a livello professionale.",
            "pipex: Masterizzazione delle tecniche di Inter-Process Communication di UNIX, orchestrando pipeline di processi con gestione impeccabile dei flussi di dati e delle risorse di sistema.",
            "fractol: Engine grafico real-time per la generazione di frattali matematici complessi con interattività fluida, ottimizzato per massime performance e precisione visiva."
        ];
        addSection("Progetti", projectsText);
        
        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const today = new Date();
        doc.text(`© ${today.getFullYear()} Raffaele Cannarsa - Curriculum Vitae | Generato il ${today.toLocaleDateString('it-IT')}`, margin, pageHeight - 10);
        
        // Save the PDF
        doc.save('Raffaele_Cannarsa_CV.pdf');
        
        // Reset button text
        downloadBtn.textContent = originalText;
    });
});