// Application State
const state = {
    showForm: false,
    currentSection: 1,
    showSummary: false,
    formData: {
        fullName: '',
        birthDate: '',
        email: '',
        phone: '',
        gender: '',
        
        chronicConditions: '',
        medications: '',
        injuries: '',
        surgeries: '',
        painAreas: '',
        painIntensity: 0,
        allergies: '',
        pregnantOrNursing: '',
        smokingHistory: '',
        alcoholConsumption: '',
        
        currentlyActive: '',
        activityType: '',
        activityDuration: '',
        experienceLevel: '',
        weeklyFrequency: 3,
        trainingLocation: '',
        
        primaryGoals: [],
        timeframe: '',
        motivation: '',
        
        dailyRoutine: '',
        sleepHours: '',
        nutritionQuality: '',
        homeEquipment: '',
        
        height: 0,
        currentWeight: 0,
        desiredWeight: 0,
    }
};

const sectionTitles = [
    'Dados Pessoais',
    'Saúde',
    'Atividade Física',
    'Objetivos',
    'Estilo de Vida',
    'Medidas'
];

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update form data
function updateFormData(field, value) {
    state.formData[field] = value;
}

// Validation
function validateSection(section) {
    const data = state.formData;
    
    switch (section) {
        case 1:
            return !!(data.fullName && data.birthDate && data.email && data.phone && data.gender);
        case 2:
            return true;
        case 3:
            return !!(data.experienceLevel && data.trainingLocation);
        case 4:
            return !!(data.primaryGoals.length > 0 && data.timeframe);
        case 5:
            return !!(data.nutritionQuality);
        case 6:
            return !!(data.height && data.currentWeight && data.desiredWeight);
        default:
            return false;
    }
}

// Navigation
function handleNext() {
    if (!validateSection(state.currentSection)) {
        showToast('Por favor, preencha todos os campos obrigatórios (*) antes de continuar.', 'error');
        return;
    }
    
    if (state.currentSection < 6) {
        state.currentSection++;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        generateSummary();
    }
}

function handlePrevious() {
    if (state.currentSection > 1) {
        state.currentSection--;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Summary Generation
function generateSummary() {
    state.showSummary = true;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Avaliação concluída! Sumário gerado com sucesso.', 'success');
}

function getSummaryData() {
    const data = state.formData;
    
    const experienceLevelMap = {
        'iniciante': 'INICIANTE',
        'intermediario': 'INTERMEDIÁRIO',
        'avancado': 'AVANÇADO',
        'muito-avancado': 'MUITO AVANÇADO',
    };
    
    const goalMap = {
        'emagrecer': 'EMAGRECER',
        'ganhar-massa': 'GANHAR MASSA',
        'condicionamento': 'CONDICIONAMENTO',
        'reduzir-dores': 'REDUZIR DORES',
        'aumentar-forca': 'AUMENTAR FORÇA',
        'saude-geral': 'SAÚDE GERAL',
        'evento-especifico': 'EVENTO ESPECÍFICO',
        'outro': 'OUTRO',
    };
    
    const goals = data.primaryGoals.map(g => goalMap[g]).join(' / ');
    
    const limitations = [];
    
    if (data.chronicConditions) limitations.push({ label: 'Condições Crônicas', value: data.chronicConditions });
    if (data.medications) limitations.push({ label: 'Medicamentos', value: data.medications });
    if (data.injuries) limitations.push({ label: 'Lesões Anteriores', value: data.injuries });
    if (data.surgeries) limitations.push({ label: 'Cirurgias Anteriores', value: data.surgeries });
    if (data.painAreas) limitations.push({ label: 'Áreas de Dor', value: `${data.painAreas} (intensidade ${data.painIntensity}/10)` });
    if (data.allergies) limitations.push({ label: 'Alergias', value: data.allergies });
    if (data.pregnantOrNursing === 'sim') limitations.push({ label: 'Condição Especial', value: 'Grávida/Amamentando' });
    
    const heightInMeters = data.height / 100;
    const bmi = data.currentWeight / (heightInMeters * heightInMeters);
    const bmiValue = bmi.toFixed(1);
    
    let bmiCategory = '';
    let bmiClass = '';
    if (bmi < 18.5) {
        bmiCategory = 'Magreza';
        bmiClass = 'bmi-underweight';
    } else if (bmi < 25) {
        bmiCategory = 'Normal';
        bmiClass = 'bmi-normal';
    } else if (bmi < 30) {
        bmiCategory = 'Sobrepeso';
        bmiClass = 'bmi-overweight';
    } else {
        bmiCategory = 'Obesidade';
        bmiClass = 'bmi-obese';
    }
    
    return {
        experienceLevel: experienceLevelMap[data.experienceLevel] || data.experienceLevel,
        primaryGoal: goals,
        medicalLimitations: limitations,
        bmi: bmiValue,
        bmiCategory,
        bmiClass,
    };
}

// Render Functions
function renderHero() {
    return `
        <div class="container container-wide">
            <div class="hero">
                <h1>Anamnese Completa</h1>
                <p>Inicie sua jornada fitness com uma anamnese detalhada. Entenda seu corpo, defina metas e crie um plano personalizado para alcançar seus objetivos.</p>
                <div class="hero-image">
                    📋 Anamnese Completa
                </div>
                <button class="btn btn-primary" onclick="startForm()" data-testid="button-start">
                    Iniciar Avaliação
                </button>
            </div>
            
            <div class="text-center">
                <h2 style="margin-bottom: 1rem;">Como funciona?</h2>
                <p class="text-muted" style="max-width: 600px; margin: 0 auto 2rem;">
                    Complete um questionário detalhado em 6 etapas para que possamos entender seu histórico de saúde, 
                    nível de experiência e objetivos. Ao final, você receberá um sumário completo que guiará a criação 
                    da sua ficha de treino personalizada.
                </p>
            </div>

            <div class="grid grid-3">
                <div class="card">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(8, 145, 178, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem; font-weight: 600; color: var(--primary);">1</span>
                    </div>
                    <h3>Informações Pessoais</h3>
                    <p class="text-muted" style="font-size: 0.875rem;">
                        Dados básicos e contato para iniciarmos sua avaliação
                    </p>
                </div>

                <div class="card">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(8, 145, 178, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem; font-weight: 600; color: var(--primary);">2</span>
                    </div>
                    <h3>Avaliação de Saúde</h3>
                    <p class="text-muted" style="font-size: 0.875rem;">
                        Histórico médico e limitações para treinar com segurança
                    </p>
                </div>

                <div class="card">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(8, 145, 178, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem; font-weight: 600; color: var(--primary);">3</span>
                    </div>
                    <h3>Sumário Personalizado</h3>
                    <p class="text-muted" style="font-size: 0.875rem;">
                        Receba um relatório completo com suas informações categorizadas
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderProgress() {
    let stepsHTML = '';
    for (let i = 1; i <= 6; i++) {
        const isActive = i === state.currentSection;
        const isCompleted = i < state.currentSection;
        const stepClass = `progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        
        stepsHTML += `
            <div class="${stepClass}">
                <div class="progress-number">${i}</div>
                <div class="progress-label">${sectionTitles[i - 1]}</div>
            </div>
        `;
    }
    
    return `
        <div class="progress">
            <div class="progress-steps">
                ${stepsHTML}
            </div>
        </div>
    `;
}

function renderSection1() {
    const data = state.formData;
    return `
        <div class="card">
            <h2>Dados Pessoais</h2>
            <p class="text-muted mb-4">Forneça suas informações básicas para iniciarmos a anamnese
            
            <div class="form-group">
                <label class="form-label required">Nome Completo</label>
                <input 
                    type="text" 
                    class="form-input" 
                    value="${data.fullName}"
                    onchange="updateFormData('fullName', this.value)"
                    data-testid="input-fullName"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label required">Data de Nascimento</label>
                <input 
                    type="date" 
                    class="form-input"
                    value="${data.birthDate}"
                    onchange="updateFormData('birthDate', this.value)"
                    data-testid="input-birthDate"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label required">Email</label>
                <input 
                    type="email" 
                    class="form-input"
                    value="${data.email}"
                    onchange="updateFormData('email', this.value)"
                    data-testid="input-email"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label required">Telefone</label>
                <input 
                    type="tel" 
                    class="form-input"
                    value="${data.phone}"
                    onchange="updateFormData('phone', this.value)"
                    data-testid="input-phone"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label required">Gênero</label>
                <select class="form-select" onchange="updateFormData('gender', this.value)" data-testid="select-gender">
                    <option value="">Selecione...</option>
                    <option value="masculino" ${data.gender === 'masculino' ? 'selected' : ''}>Masculino</option>
                    <option value="feminino" ${data.gender === 'feminino' ? 'selected' : ''}>Feminino</option>
                    <option value="outro" ${data.gender === 'outro' ? 'selected' : ''}>Outro</option>
                </select>
            </div>
        </div>
    `;
}

function renderSection2() {
    const data = state.formData;
    return `
        <div class="card">
            <h2>Saúde e Histórico Médico</h2>
            <p class="text-muted mb-4">Informações importantes para garantir sua segurança</p>
            
            <div class="form-group">
                <label class="form-label">Condições Crônicas (ex: diabetes, hipertensão)</label>
                <input 
                    type="text" 
                    class="form-input" 
                    value="${data.chronicConditions}"
                    onchange="updateFormData('chronicConditions', this.value)"
                    data-testid="input-chronicConditions"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label">Medicamentos em Uso</label>
                <input 
                    type="text" 
                    class="form-input" 
                    value="${data.medications}"
                    onchange="updateFormData('medications', this.value)"
                    data-testid="input-medications"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label">Lesões ou Cirurgias Anteriores</label>
                <input 
                    type="text" 
                    class="form-input" 
                    value="${data.injuries}"
                    onchange="updateFormData('injuries', this.value)"
                    data-testid="input-injuries"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label">Áreas com Dor ou Desconforto</label>
                <input 
                    type="text" 
                    class="form-input" 
                    value="${data.painAreas}"
                    onchange="updateFormData('painAreas', this.value)"
                    data-testid="input-painAreas"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label">Intensidade da Dor (0 a 10)</label>
                <div class="slider-container">
                    <input 
                        type="range" 
                        class="slider"
                        min="0" 
                        max="10" 
                        value="${data.painIntensity}"
                        oninput="updateFormData('painIntensity', parseInt(this.value)); document.getElementById('pain-value').textContent = this.value"
                        data-testid="slider-painIntensity"
                    />
                    <span class="slider-value" id="pain-value">${data.painIntensity}</span>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Alergias</label>
                <input 
                    type="text" 
                    class="form-input" 
                    value="${data.allergies}"
                    onchange="updateFormData('allergies', this.value)"
                    data-testid="input-allergies"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label">Está grávida ou amamentando?</label>
                <select class="form-select" onchange="updateFormData('pregnantOrNursing', this.value)" data-testid="select-pregnantOrNursing">
                    <option value="">Selecione...</option>
                    <option value="nao" ${data.pregnantOrNursing === 'nao' ? 'selected' : ''}>Não</option>
                    <option value="sim" ${data.pregnantOrNursing === 'sim' ? 'selected' : ''}>Sim</option>
                </select>
            </div>
        </div>
    `;
}

function renderSection3() {
    const data = state.formData;
    return `
        <div class="card">
            <h2>Atividade Física</h2>
            <p class="text-muted mb-4">Conte-nos sobre seu nível de atividade e preferências</p>
            
            <div class="form-group">
                <label class="form-label">Você está atualmente ativo?</label>
                <select class="form-select" onchange="updateFormData('currentlyActive', this.value)" data-testid="select-currentlyActive">
                    <option value="">Selecione...</option>
                    <option value="sim" ${data.currentlyActive === 'sim' ? 'selected' : ''}>Sim</option>
                    <option value="nao" ${data.currentlyActive === 'nao' ? 'selected' : ''}>Não</option>
                </select>
            </div>
            
            ${data.currentlyActive === 'sim' ? `
                <div class="form-group">
                    <label class="form-label">Qual Atividade?</label>
                    <input 
                        type="text" 
                        class="form-input"
                        value="${data.activityType}"
                        onchange="updateFormData('activityType', this.value)"
                        placeholder="Ex: musculação, corrida, yoga"
                        data-testid="input-activityType"
                    />
                </div>
                
                <div class="form-group">
                    <label class="form-label">Há Quanto Tempo?</label>
                    <select class="form-select" onchange="updateFormData('activityDuration', this.value)" data-testid="select-activityDuration">
                        <option value="">Selecione...</option>
                        <option value="menos-3-meses" ${data.activityDuration === 'menos-3-meses' ? 'selected' : ''}>Menos de 3 meses</option>
                        <option value="3-6-meses" ${data.activityDuration === '3-6-meses' ? 'selected' : ''}>3-6 meses</option>
                        <option value="6-12-meses" ${data.activityDuration === '6-12-meses' ? 'selected' : ''}>6-12 meses</option>
                        <option value="1-2-anos" ${data.activityDuration === '1-2-anos' ? 'selected' : ''}>1-2 anos</option>
                        <option value="mais-2-anos" ${data.activityDuration === 'mais-2-anos' ? 'selected' : ''}>Mais de 2 anos</option>
                    </select>
                </div>
            ` : ''}
            
            <div class="form-group">
                <label class="form-label required">Nível de Experiência</label>
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="exp-iniciante" name="experience" value="iniciante" ${data.experienceLevel === 'iniciante' ? 'checked' : ''} onchange="updateFormData('experienceLevel', this.value)">
                        <label class="radio-label" for="exp-iniciante" data-testid="radio-exp-iniciante">Iniciante</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="exp-inter" name="experience" value="intermediario" ${data.experienceLevel === 'intermediario' ? 'checked' : ''} onchange="updateFormData('experienceLevel', this.value)">
                        <label class="radio-label" for="exp-inter" data-testid="radio-exp-intermediario">Intermediário</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="exp-avanc" name="experience" value="avancado" ${data.experienceLevel === 'avancado' ? 'checked' : ''} onchange="updateFormData('experienceLevel', this.value)">
                        <label class="radio-label" for="exp-avanc" data-testid="radio-exp-avancado">Avançado</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Frequência Semanal Desejada</label>
                <div class="slider-container">
                    <input 
                        type="range" 
                        class="slider"
                        min="1" 
                        max="7" 
                        value="${data.weeklyFrequency}"
                        oninput="updateFormData('weeklyFrequency', parseInt(this.value)); document.getElementById('freq-value').textContent = this.value + 'x/semana'"
                        data-testid="slider-weeklyFrequency"
                    />
                    <span class="slider-value" id="freq-value">${data.weeklyFrequency}x/semana</span>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Local de Treino Preferido</label>
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="loc-academia" name="location" value="academia" ${data.trainingLocation === 'academia' ? 'checked' : ''} onchange="updateFormData('trainingLocation', this.value)">
                        <label class="radio-label" for="loc-academia" data-testid="radio-loc-academia">Academia</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="loc-casa" name="location" value="casa" ${data.trainingLocation === 'casa' ? 'checked' : ''} onchange="updateFormData('trainingLocation', this.value)">
                        <label class="radio-label" for="loc-casa" data-testid="radio-loc-casa">Casa</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="loc-ar-livre" name="location" value="ar-livre" ${data.trainingLocation === 'ar-livre' ? 'checked' : ''} onchange="updateFormData('trainingLocation', this.value)">
                        <label class="radio-label" for="loc-ar-livre" data-testid="radio-loc-ar-livre">Ar Livre</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSection4() {
    const data = state.formData;
    return `
        <div class="card">
            <h2>Objetivos</h2>
            <p class="text-muted mb-4">Defina suas metas e motivações para treinar</p>
            
            <div class="form-group">
                <label class="form-label required">Objetivos Principais (selecione um ou mais)</label>
                <div class="checkbox-group">
                    <div class="checkbox-option">
                        <input type="checkbox" id="goal-emagrecer" value="emagrecer" ${data.primaryGoals.includes('emagrecer') ? 'checked' : ''} onchange="toggleGoal('emagrecer')">
                        <label class="checkbox-label" for="goal-emagrecer">Emagrecer</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="goal-massa" value="ganhar-massa" ${data.primaryGoals.includes('ganhar-massa') ? 'checked' : ''} onchange="toggleGoal('ganhar-massa')">
                        <label class="checkbox-label" for="goal-massa">Ganhar Massa Muscular</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="goal-cond" value="condicionamento" ${data.primaryGoals.includes('condicionamento') ? 'checked' : ''} onchange="toggleGoal('condicionamento')">
                        <label class="checkbox-label" for="goal-cond">Melhorar Condicionamento</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="goal-dores" value="reduzir-dores" ${data.primaryGoals.includes('reduzir-dores') ? 'checked' : ''} onchange="toggleGoal('reduzir-dores')">
                        <label class="checkbox-label" for="goal-dores">Reduzir Dores</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="goal-forca" value="aumentar-forca" ${data.primaryGoals.includes('aumentar-forca') ? 'checked' : ''} onchange="toggleGoal('aumentar-forca')">
                        <label class="checkbox-label" for="goal-forca">Aumentar Força</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="goal-saude" value="saude-geral" ${data.primaryGoals.includes('saude-geral') ? 'checked' : ''} onchange="toggleGoal('saude-geral')">
                        <label class="checkbox-label" for="goal-saude">Saúde Geral</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Prazo para Atingir Objetivos</label>
                <select class="form-select" onchange="updateFormData('timeframe', this.value)">
                    <option value="">Selecione...</option>
                    <option value="1-3-meses" ${data.timeframe === '1-3-meses' ? 'selected' : ''}>1-3 meses</option>
                    <option value="3-6-meses" ${data.timeframe === '3-6-meses' ? 'selected' : ''}>3-6 meses</option>
                    <option value="6-12-meses" ${data.timeframe === '6-12-meses' ? 'selected' : ''}>6-12 meses</option>
                    <option value="mais-1-ano" ${data.timeframe === 'mais-1-ano' ? 'selected' : ''}>Mais de 1 ano</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">O que te motiva?</label>
                <textarea 
                    class="form-textarea"
                    onchange="updateFormData('motivation', this.value)"
                    placeholder="Compartilhe suas motivações para treinar..."
                >${data.motivation}</textarea>
            </div>
        </div>
    `;
}

function renderSection5() {
    const data = state.formData;
    return `
        <div class="card">
            <h2>Estilo de Vida</h2>
            <p class="text-muted mb-4">Informações sobre sua rotina diária, sono e nutrição</p>
            
            <div class="form-group">
                <label class="form-label">Rotina Diária</label>
                <textarea 
                    class="form-textarea"
                    onchange="updateFormData('dailyRoutine', this.value)"
                >${data.dailyRoutine}</textarea>
                <p class="form-hint">Descreva brevemente sua rotina (trabalho, deslocamento, etc.).</p>
            </div>
            
            <div class="form-group">
                <label class="form-label">Horas de Sono por Noite</label>
                <input 
                    type="number" 
                    class="form-input" 
                    min="0"
                    max="12"
                    value="${data.sleepHours}"
                    onchange="updateFormData('sleepHours', this.value)"
                />
                <p class="form-hint">Média de horas que você dorme por noite. (Opcional)</p>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Qualidade da Nutrição</label>
                <select class="form-select" onchange="updateFormData('nutritionQuality', this.value)">
                    <option value="">Selecione...</option>
                    <option value="excelente" ${data.nutritionQuality === 'excelente' ? 'selected' : ''}>Excelente (Dieta balanceada, poucas exceções)</option>
                    <option value="boa" ${data.nutritionQuality === 'boa' ? 'selected' : ''}>Boa (Geralmente saudável, mas com deslizes)</option>
                    <option value="regular" ${data.nutritionQuality === 'regular' ? 'selected' : ''}>Regular (Precisa de melhorias significativas)</option>
                    <option value="ruim" ${data.nutritionQuality === 'ruim' ? 'selected' : ''}>Ruim (Alimentação desregrada, fast-food frequente)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Equipamento de Treino em Casa (Opcional)</label>
                <input 
                    type="text" 
                    class="form-input" 
                    value="${data.homeEquipment}"
                    onchange="updateFormData('homeEquipment', this.value)"
                />
                <p class="form-hint">Ex: Halteres, elásticos, kettlebell, etc.</p>
            </div>
        </div>
    `;
}

function renderSection6() {
    const data = state.formData;
    return `
        <div class="card">
            <h2>Medidas Corporais</h2>
            <p class="text-muted mb-4">Informações para cálculo de IMC e acompanhamento</p>
            
            <div class="form-group">
                <label class="form-label required">Altura (m)</label>
                <input 
                    type="number" 
                    class="form-input" 
                    min="1"
                    max="2.5"
                    step="0.01"
                    value="${(data.height / 100) || ''}"
                    onchange="updateFormData('height', parseFloat(this.value) * 100)"
                    data-testid="input-height"
                />
                <p class="form-hint">Em metros (ex: 1.75)</p>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Peso Atual (kg)</label>
                <input 
                    type="number" 
                    class="form-input" 
                    value="${data.currentWeight || ''}"
                    onchange="updateFormData('currentWeight', parseInt(this.value))"
                    placeholder="Ex: 75"
                    data-testid="input-currentWeight"
                />
            </div>
            
            <div class="form-group">
                <label class="form-label required">Peso Desejado (kg)</label>
                <input 
                    type="number" 
                    class="form-input" 
                    value="${data.desiredWeight || ''}"
                    onchange="updateFormData('desiredWeight', parseInt(this.value))"
                    placeholder="Ex: 70"
                    data-testid="input-desiredWeight"
                />
            </div>
        </div>
    `;
}

function renderForm() {
    const sections = [
        renderSection1,
        renderSection2,
        renderSection3,
        renderSection4,
        renderSection5,
        renderSection6
    ];
    
    return `
        <div class="container">
            ${renderProgress()}
            ${sections[state.currentSection - 1]()}
            
            <div class="form-navigation">
                <button 
                    class="btn btn-outline" 
                    onclick="handlePrevious()"
                    ${state.currentSection === 1 ? 'disabled' : ''}
                    data-testid="button-previous"
                >
                    ← Voltar
                </button>
                
                <button 
                    class="btn btn-primary" 
                    onclick="handleNext()"
                    data-testid="button-next"
                >
                    ${state.currentSection === 6 ? '✓ Gerar Resumo' : 'Próxima Seção →'}
                </button>
            </div>
        </div>
    `;
}

function renderSummary() {
    const summary = getSummaryData();
    const data = state.formData;
    
    return `
        <div class="container">
            <div class="summary-card">
                <div class="summary-header">
                    <h1>Sumário da Avaliação</h1>
                    <p class="text-muted">Análise completa do seu perfil para criação do treino.</p>
                </div>

                <!-- Seção 1: Perfil Geral -->
                <div class="summary-section">
                    <h3>Perfil Geral</h3>
                    <div class="summary-item">
                        <span class="summary-label">Nome</span>
                        <span class="summary-value">${data.fullName}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Nível de Experiência</span>
                        <span class="summary-value">${summary.experienceLevel}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Objetivo Principal</span>
                        <span class="summary-value">${summary.primaryGoal}</span>
                    </div>
                </div>

                <!-- Seção 2: Limitações e Cuidados -->
                <div class="summary-section">
                    <h3>Limitações e Cuidados</h3>
                    ${summary.medicalLimitations.length > 0 ? 
                        summary.medicalLimitations.map(item => `
                            <div class="summary-item">
                                <span class="summary-label">${item.label}</span>
                                <span class="summary-value">${item.value}</span>
                            </div>
                        `).join('')
                        : '<p class="text-muted">Nenhuma limitação relevante informada.</p>'
                    }
                </div>

                <!-- Seção 3: Medidas Corporais -->
                <div class="summary-section">
                    <h3>Medidas Corporais</h3>
                    <div class="summary-item">
                        <span class="summary-label">Altura</span>
                        <span class="summary-value">${(data.height / 100).toFixed(2)} m</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Peso Atual</span>
                        <span class="summary-value">${data.currentWeight} kg</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Peso Desejado</span>
                        <span class="summary-value">${data.desiredWeight} kg</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">IMC (Índice de Massa Corporal)</span>
                        <span class="summary-value">
                            ${summary.bmi} 
                            <span class="bmi-indicator ${summary.bmiClass}">${summary.bmiCategory}</span>
                        </span>
                    </div>
                </div>

                <!-- Seção 4: Estilo de Vida -->
                <div class="summary-section">
                    <h3>Estilo de Vida</h3>
                    <div class="summary-item">
                        <span class="summary-label">Rotina Diária</span>
                        <span class="summary-value">${data.dailyRoutine || 'Não informado'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Horas de Sono</span>
                        <span class="summary-value">${data.sleepHours ? data.sleepHours + 'h' : 'Não informado'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Qualidade da Nutrição</span>
                        <span class="summary-value">${data.nutritionQuality}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Equipamento em Casa</span>
                        <span class="summary-value">${data.homeEquipment || 'Nenhum'}</span>
                    </div>
                </div>

                <div class="summary-actions">
                    <button class="btn btn-outline" onclick="state.showSummary = false; render();">
                        Voltar ao Formulário
                    </button>
                    <button class="btn btn-primary" onclick="showToast('Funcionalidade de Exportar em desenvolvimento', 'info');">
                        Exportar Sumário
                    </button>
                </div>
            </div>
        </div>
    `;
}


// Main Render Function
function render() {
    const app = document.getElementById('app');
    
    if (!state.showForm) {
        app.innerHTML = renderHero();
    } else if (state.showSummary) {
        app.innerHTML = renderSummary();
    } else {
        app.innerHTML = renderForm();
    }
}

// Event Handlers
function startForm() {
    state.showForm = true;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToForm() {
    state.showSummary = false;
    state.currentSection = 6;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initial Render
render();

function toggleGoal(goal) {
    const index = state.formData.primaryGoals.indexOf(goal);
    if (index > -1) {
        state.formData.primaryGoals.splice(index, 1);
    } else {
        state.formData.primaryGoals.push(goal);
    }
    render();
}