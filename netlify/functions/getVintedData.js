async function analyzeScreenshot() {
    const input = document.getElementById('screenshot-input');
    const file = input.files[0];
    
    if (!file) {
        alert('Veuillez sélectionner une image');
        return;
    }

    // Afficher l'état de chargement
    document.getElementById('stats').style.display = 'block';
    const elements = document.querySelectorAll('.stat-value');
    elements.forEach(el => {
        el.textContent = 'Chargement...';
    });

    try {
        // Convertir l'image en base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = async () => {
            const response = await fetch('/.netlify/functions/getVintedData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: reader.result })
            });

            if (!response.ok) throw new Error('Erreur réseau');
            
            const data = await response.json();
            
            // Mettre à jour l'interface
            document.getElementById('total-items').textContent = data.articlesEnVente;
            document.getElementById('total-sold').textContent = data.articlesVendus;
            document.getElementById('total-likes').textContent = data.evaluations;
        };
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'analyse de l\'image');
    }
}
