const assets = {
    cash: { label: "Cash", icon: "💵", risk: 1, color: "#28a745" },
    bonds: { label: "Bonds", icon: "🟩", risk: 2, color: "#20c997" },
    index: { label: "Index Funds", icon: "📦", risk: 3, color: "#ffc107" },
    stocks: { label: "Stocks", icon: "📈", risk: 4, color: "#ff9800" },
    crypto: { label: "Crypto", icon: "🪙", risk: 5, color: "#dc3545" }
  };
  
  const portfolio = {
    cash: 0,
    bonds: 0,
    index: 0,
    stocks: 0,
    crypto: 0
  };
  
  let portfolioChart = null;
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    setupDragAndDrop();
    setupQuiz();
    highlightCurrentPage();
    initializeChart();
  });
  
  function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  function setupDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-asset');
    const dropZone = document.getElementById('dropZone');
    const resetButton = document.getElementById('resetPortfolio');
  
    if (!dropZone) {
      console.log('No dropZone found on this page');
      return;
    }
  
    console.log('Setting up drag and drop for', draggables.length, 'assets');
  
    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', handleDragStart);
      draggable.addEventListener('dragend', handleDragEnd);
    });
  
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
  
    if (resetButton) {
      resetButton.addEventListener('click', resetPortfolio);
    }
  
    initializeChart();
    updatePortfolio();
  }
  
  let dragScrollInterval = null;
  
  function handleDragStart(e) {
    console.log('Drag started:', e.currentTarget.dataset.asset);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.asset);
    e.currentTarget.style.opacity = '0.5';
  
    document.addEventListener('drag', autoScrollWhileDragging);
  }
  
  function handleDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    document.removeEventListener('drag', autoScrollWhileDragging);
    if (dragScrollInterval) {
      clearInterval(dragScrollInterval);
      dragScrollInterval = null;
    }
  }
  
  function autoScrollWhileDragging(e) {
    const scrollSpeed = 15;
    const edgeThreshold = 100;
    const viewportHeight = window.innerHeight;
    const mouseY = e.clientY;
  
    if (mouseY > 0) {
      if (mouseY < edgeThreshold) {
        window.scrollBy(0, -scrollSpeed);
      } else if (mouseY > viewportHeight - edgeThreshold) {
        window.scrollBy(0, scrollSpeed);
      }
    }
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.currentTarget.classList.add('drag-over');
  }
  
  function handleDragLeave(e) {
    if (e.currentTarget === e.target) {
      e.currentTarget.classList.remove('drag-over');
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    console.log('Drop event fired');
    e.currentTarget.classList.remove('drag-over');
  
    const assetType = e.dataTransfer.getData('text/plain');
    console.log('Dropped asset:', assetType);
  
    if (assetType && assets[assetType]) {
      addAssetToPortfolio(assetType);
  
      const dropZone = e.currentTarget;
      dropZone.style.transform = 'scale(1.05)';
      setTimeout(() => {
        dropZone.style.transform = 'scale(1)';
      }, 200);
    }
  }
  
  function addAssetToPortfolio(assetType) {
    console.log('Adding asset to portfolio:', assetType);
    portfolio[assetType]++;
    updatePortfolio();
  }
  
  function removeAssetFromPortfolio(assetType) {
    console.log('Removing asset from portfolio:', assetType);
    if (portfolio[assetType] > 0) {
      portfolio[assetType]--;
      updatePortfolio();
    }
  }
  
  function resetPortfolio() {
    console.log('Resetting portfolio');
    Object.keys(portfolio).forEach(key => {
      portfolio[key] = 0;
    });
    updatePortfolio();
  }
  
  function updatePortfolio() {
    console.log('Updating portfolio:', portfolio);
    const portfolioBlocks = document.getElementById('portfolioBlocks');
    const placeholder = document.querySelector('.drop-zone-placeholder');
  
    if (!portfolioBlocks) return;
  
    portfolioBlocks.innerHTML = '';
  
    const totalAssets = Object.values(portfolio).reduce((a, b) => a + b, 0);
  
    if (totalAssets === 0) {
      if (placeholder) placeholder.style.display = 'block';
    } else {
      if (placeholder) placeholder.style.display = 'none';
  
      Object.keys(portfolio).forEach(assetType => {
        const count = portfolio[assetType];
        if (count > 0) {
          const asset = assets[assetType];
          for (let i = 0; i < count; i++) {
            const block = document.createElement('div');
            block.className = 'portfolio-block';
            block.innerHTML = `
              <span class="block-icon">${asset.icon}</span>
              <div class="block-info">
                <h6>${asset.label}</h6>
                <small>Risk: ${asset.risk}/5</small>
              </div>
              <button class="remove-block" onclick="removeAssetFromPortfolio('${assetType}')">Remove</button>
            `;
            portfolioBlocks.appendChild(block);
          }
        }
      });
    }
  
    updateChart();
    updateRiskMeter();
    updatePortfolioExplanation();
  }
  
  function initializeChart() {
    const canvas = document.getElementById('portfolioChart');
    if (!canvas) {
      console.log('No chart canvas found on this page');
      return;
    }
  
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not loaded');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    portfolioChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: '600'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const percentage = ((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                return `${label}: ${value} blocks (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800,
          easing: 'easeOutCubic'
        }
      }
    });
  }
  
  function updateChart() {
    if (!portfolioChart) return;
  
    const labels = [];
    const data = [];
    const colors = [];
  
    Object.keys(portfolio).forEach(assetType => {
      if (portfolio[assetType] > 0) {
        labels.push(assets[assetType].label);
        data.push(portfolio[assetType]);
        colors.push(assets[assetType].color);
      }
    });
  
    portfolioChart.data.labels = labels;
    portfolioChart.data.datasets[0].data = data;
    portfolioChart.data.datasets[0].backgroundColor = colors;
    portfolioChart.update();
  
    updatePortfolioSummary();
  }
  
  function updatePortfolioSummary() {
    const summaryDiv = document.getElementById('portfolioSummary');
    if (!summaryDiv) return;
  
    const totalAssets = Object.values(portfolio).reduce((a, b) => a + b, 0);
  
    if (totalAssets === 0) {
      summaryDiv.innerHTML = '<div class="text-muted">No assets in portfolio yet</div>';
      return;
    }
  
    let html = '<div><strong>Total Assets:</strong> ' + totalAssets + ' blocks</div>';
  
    Object.keys(portfolio).forEach(assetType => {
      if (portfolio[assetType] > 0) {
        const percentage = ((portfolio[assetType] / totalAssets) * 100).toFixed(1);
        html += `<div><strong>${assets[assetType].label}:</strong> ${portfolio[assetType]} blocks (${percentage}%)</div>`;
      }
    });
  
    summaryDiv.innerHTML = html;
  }
  
  function updateRiskMeter() {
    const riskMeterFill = document.getElementById('riskMeterFill');
    const riskDescription = document.getElementById('riskDescription');
  
    if (!riskMeterFill || !riskDescription) return;
  
    const totalAssets = Object.values(portfolio).reduce((a, b) => a + b, 0);
  
    if (totalAssets === 0) {
      riskMeterFill.style.width = '0%';
      riskDescription.className = 'alert alert-info';
      riskDescription.innerHTML = `
        <strong>No assets yet</strong>
        <p class="mb-0 mt-2">Start by dragging some assets into your portfolio to see your risk level.</p>
      `;
      return;
    }
  
    let weightedRisk = 0;
    Object.keys(portfolio).forEach(assetType => {
      weightedRisk += portfolio[assetType] * assets[assetType].risk;
    });
  
    const avgRisk = weightedRisk / totalAssets;
    const riskPercentage = (avgRisk / 5) * 100;
  
    riskMeterFill.style.width = riskPercentage + '%';
  
    let riskLevel, riskClass, riskMessage;
  
    if (avgRisk <= 2) {
      riskLevel = 'Low';
      riskClass = 'alert-success';
      riskMessage = 'Your portfolio is conservative with lower risk assets. Good for stability but may have slower growth.';
    } else if (avgRisk <= 3.5) {
      riskLevel = 'Medium';
      riskClass = 'alert-warning';
      riskMessage = 'Your portfolio has a balanced mix of risk. This could provide moderate growth with manageable volatility.';
    } else {
      riskLevel = 'High';
      riskClass = 'alert-danger';
      riskMessage = 'Your portfolio is aggressive with higher risk assets. Potential for high returns but also significant losses.';
    }
  
    riskDescription.className = 'alert ' + riskClass;
    riskDescription.innerHTML = `
      <strong>Risk Level: ${riskLevel} (${avgRisk.toFixed(1)}/5)</strong>
      <p class="mb-0 mt-2">${riskMessage}</p>
    `;
  }
  
  function updatePortfolioExplanation() {
    const explanationDiv = document.getElementById('portfolioExplanation');
    if (!explanationDiv) return;
  
    const totalAssets = Object.values(portfolio).reduce((a, b) => a + b, 0);
  
    if (totalAssets === 0) {
      explanationDiv.innerHTML = '<p class="text-muted">Build your portfolio to see personalized insights and suggestions.</p>';
      return;
    }
  
    let html = '';
  
    const cashPercent = (portfolio.cash / totalAssets) * 100;
    const cryptoPercent = (portfolio.crypto / totalAssets) * 100;
    const stockPercent = (portfolio.stocks / totalAssets) * 100;
    const bondsPercent = (portfolio.bonds / totalAssets) * 100;
    const indexPercent = (portfolio.index / totalAssets) * 100;
  
    if (cashPercent > 50) {
      html += '<h6>Too Much Cash?</h6><p>You have over 50% in cash. While safe, this might not grow much. Consider adding some bonds or index funds for better returns.</p>';
    }
  
    if (cryptoPercent > 30) {
      html += '<h6>High Crypto Exposure</h6><p>Over 30% in crypto is very risky. Consider reducing this and adding more stable assets like bonds or index funds.</p>';
    }
  
    if (stockPercent + cryptoPercent > 70) {
      html += '<h6>Very Aggressive Portfolio</h6><p>Your portfolio is heavily weighted toward high-risk assets. This could lead to big gains or big losses. Consider adding some bonds for stability.</p>';
    }
  
    if (bondsPercent > 60) {
      html += '<h6>Very Conservative</h6><p>Your portfolio is mostly bonds. Very safe, but growth might be slow. Consider adding some index funds for better long-term returns.</p>';
    }
  
    if (indexPercent > 50 && cryptoPercent < 10 && stockPercent < 20) {
      html += '<h6>Well-Balanced Approach</h6><p>Your portfolio is well-diversified with index funds as the core. This is a solid strategy for long-term growth with manageable risk.</p>';
    }
  
    if (totalAssets >= 5 && Math.max(cashPercent, bondsPercent, indexPercent, stockPercent, cryptoPercent) < 40) {
      html += '<h6>Great Diversification!</h6><p>Your portfolio is well-diversified across multiple asset types. This helps manage risk while maintaining growth potential.</p>';
    }
  
    if (html === '') {
      html = '<p>Keep building your portfolio! Try different combinations to see how the risk and potential returns change.</p>';
    }
  
    explanationDiv.innerHTML = html;
  }
  
  const quizQuestions = [
    {
      question: "If you put all your money in one stock, is that diversified?",
      options: ["Yes", "No"],
      correct: 1,
      explanation: "No! Diversification means spreading your money across different assets to reduce risk."
    },
    {
      question: "Which portfolio is usually safer long-term?",
      options: ["100% Crypto", "A mix of Cash, Bonds, and Index Funds"],
      correct: 1,
      explanation: "A diversified mix is safer because different assets balance each other's risks."
    },
    {
      question: "What does diversification do?",
      options: ["Removes all risk", "Reduces risk by spreading money"],
      correct: 1,
      explanation: "Diversification reduces risk but doesn't eliminate it. It helps balance your portfolio."
    },
    {
      question: "Why might someone still hold some cash?",
      options: ["To be ready for crashes and emergencies", "For fun"],
      correct: 0,
      explanation: "Cash provides liquidity and stability during market crashes and personal emergencies."
    },
    {
      question: "What's the best approach to investing in stocks?",
      options: ["Buy and sell quickly to make fast money", "Think long-term (5-10+ years) and be patient"],
      correct: 1,
      explanation: "Long-term investing helps you ride out market volatility and benefit from compound growth."
    },
    {
      question: "During the 2020 market crash, what helped investors the most?",
      options: ["Having only stocks", "Having cash available"],
      correct: 1,
      explanation: "Cash provided stability and allowed investors to buy stocks at discount prices."
    },
    {
      question: "What happened to government bonds during the 2008 crisis?",
      options: ["They went up in value", "They crashed along with stocks"],
      correct: 0,
      explanation: "Safe government bonds increased in value as investors sought safety during the crisis."
    },
    {
      question: "What's the main advantage of index funds?",
      options: ["They guarantee profits", "They provide instant diversification"],
      correct: 1,
      explanation: "Index funds hold many companies, giving you instant diversification in one investment."
    },
    {
      question: "How much of your portfolio should typically be in crypto?",
      options: ["A small portion (5-10%)", "Most of it (70-80%)"],
      correct: 0,
      explanation: "Crypto is very volatile. Experts recommend keeping it to a small portion of your portfolio."
    },
    {
      question: "What does the S&P 500 average return teach us?",
      options: ["Markets always go up quickly", "Long-term investing can overcome short-term crashes"],
      correct: 1,
      explanation: "Despite crashes, the S&P 500 has averaged ~10% annually over decades, rewarding patient investors."
    },
    {
      question: "What's a key lesson from Amazon's dot-com crash story?",
      options: ["Individual stocks are very risky", "All tech stocks always recover"],
      correct: 0,
      explanation: "Amazon recovered, but most dot-com companies failed. Individual stocks are much riskier than diversified funds."
    },
    {
      question: "What does 'risk' mean in investing?",
      options: ["The chance of losing money", "How much money you invest"],
      correct: 0,
      explanation: "Risk refers to the potential for losing value or not getting expected returns."
    },
    {
      question: "Why is a 60/40 portfolio (stocks/bonds) popular?",
      options: ["It guarantees no losses", "It balances growth potential with stability"],
      correct: 1,
      explanation: "This mix aims to capture stock growth while bonds provide cushion during downturns."
    },
    {
      question: "What's the danger of panic selling during a crash?",
      options: ["You lock in losses and miss the recovery", "Nothing, it's always smart"],
      correct: 0,
      explanation: "Panic selling turns paper losses into real ones and causes you to miss the eventual recovery."
    },
    {
      question: "What's an emergency fund?",
      options: ["Cash saved for unexpected expenses", "Money for investing in crashes"],
      correct: 0,
      explanation: "An emergency fund is cash set aside for unexpected life events, typically 3-6 months of expenses."
    },
    {
      question: "Which asset is most liquid?",
      options: ["Cash", "Real estate"],
      correct: 0,
      explanation: "Cash is the most liquid asset - you can use it immediately without selling anything."
    },
    {
      question: "What's compound growth?",
      options: ["Earning returns on your returns over time", "Getting paid twice"],
      correct: 0,
      explanation: "Compound growth happens when your investment earnings generate their own earnings over time."
    },
    {
      question: "Why are index funds good for beginners?",
      options: ["They're simple and automatically diversified", "They never lose money"],
      correct: 0,
      explanation: "Index funds are beginner-friendly because they're simple to understand and provide instant diversification."
    },
    {
      question: "What's volatility?",
      options: ["How much an investment's value fluctuates", "How quickly you can sell"],
      correct: 0,
      explanation: "Volatility measures how much and how quickly an investment's price changes up and down."
    },
    {
      question: "Why shouldn't you invest money you need soon?",
      options: ["Market might be down when you need it", "It's against the rules"],
      correct: 0,
      explanation: "Short-term investing is risky because markets fluctuate and might be down when you need the money."
    }
  ];
  
  let currentQuiz = [];
  let userAnswers = {};
  
  function setupQuiz() {
    const quizForm = document.getElementById('quizForm');
    if (!quizForm) return;
  
    generateNewQuiz();
  
    quizForm.addEventListener('submit', function(e) {
      e.preventDefault();
      gradeQuiz();
    });
  
    const retakeBtn = document.getElementById('retakeQuiz');
    const regenerateBtn = document.getElementById('regenerateQuiz');
  
    if (retakeBtn) {
      retakeBtn.addEventListener('click', retakeQuiz);
    }
  
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', generateNewQuiz);
    }
  }
  
  function generateNewQuiz() {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    currentQuiz = shuffled.slice(0, 10);
    userAnswers = {};
    renderQuiz();
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizForm').style.display = 'block';
  }
  
  function renderQuiz() {
    const quizForm = document.getElementById('quizForm');
    if (!quizForm) return;
  
    const submitButton = quizForm.querySelector('button[type="submit"]');
    quizForm.innerHTML = '';
  
    currentQuiz.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'quiz-question mb-4';
      questionDiv.innerHTML = `
        <h5 class="mb-3">${index + 1}. ${q.question}</h5>
        ${q.options.map((option, optIndex) => `
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="q${index}" value="${optIndex}" id="q${index}_${optIndex}">
            <label class="form-check-label" for="q${index}_${optIndex}">${option}</label>
          </div>
        `).join('')}
        <div class="quiz-feedback" data-question="q${index}" style="display: none;"></div>
      `;
      quizForm.appendChild(questionDiv);
    });
  
    quizForm.appendChild(submitButton);
  }
  
  function retakeQuiz() {
    userAnswers = {};
    const inputs = document.querySelectorAll('#quizForm input[type="radio"]');
    inputs.forEach(input => {
      input.checked = false;
      input.disabled = false;
    });
  
    const feedbacks = document.querySelectorAll('.quiz-feedback');
    feedbacks.forEach(feedback => {
      feedback.style.display = 'none';
      feedback.className = 'quiz-feedback';
    });
  
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizForm').style.display = 'block';
  
    document.getElementById('quizForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  function gradeQuiz() {
    let correctCount = 0;
    const totalQuestions = currentQuiz.length;
    const reviewData = [];
  
    currentQuiz.forEach((q, index) => {
      const selectedInput = document.querySelector(`input[name="q${index}"]:checked`);
      const userAnswer = selectedInput ? parseInt(selectedInput.value) : -1;
      const isCorrect = userAnswer === q.correct;
  
      if (isCorrect) {
        correctCount++;
      }
  
      reviewData.push({
        question: q.question,
        userAnswer: userAnswer,
        correctAnswer: q.correct,
        options: q.options,
        explanation: q.explanation,
        isCorrect: isCorrect
      });
  
      const inputs = document.querySelectorAll(`input[name="q${index}"]`);
      inputs.forEach(input => {
        input.disabled = true;
      });
    });
  
    const resultsDiv = document.getElementById('quizResults');
    const resultAlert = document.getElementById('quizResultAlert');
    const scoreSpan = document.getElementById('quizScore');
    const totalSpan = document.getElementById('quizTotal');
    const messageP = document.getElementById('quizMessage');
  
    scoreSpan.textContent = correctCount;
    totalSpan.textContent = totalQuestions;
  
    const percentage = (correctCount / totalQuestions) * 100;
  
    if (percentage >= 80) {
      resultAlert.className = 'alert alert-success';
      messageP.textContent = 'Excellent! You really understand investing basics!';
    } else if (percentage >= 60) {
      resultAlert.className = 'alert alert-info';
      messageP.textContent = 'Good job! Review the explanations to strengthen your knowledge.';
    } else {
      resultAlert.className = 'alert alert-warning';
      messageP.textContent = 'Keep learning! Review the stories and explanations above.';
    }
  
    displayQuizReview(reviewData);
  
    resultsDiv.style.display = 'block';
    document.getElementById('quizForm').style.display = 'none';
  
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  function displayQuizReview(reviewData) {
    const reviewDiv = document.getElementById('quizReview');
    if (!reviewDiv) return;
  
    let html = '<h5 class="mb-4">Review Your Answers:</h5>';
  
    reviewData.forEach((item, index) => {
      const statusIcon = item.isCorrect ? '✓' : '✗';
      const statusClass = item.isCorrect ? 'success' : 'danger';
      const statusText = item.isCorrect ? 'Correct' : 'Incorrect';
  
      html += `
        <div class="quiz-review-item mb-4">
          <div class="d-flex align-items-start mb-2">
            <span class="badge bg-${statusClass} me-2">${statusIcon}</span>
            <div class="flex-grow-1">
              <h6 class="mb-2"><strong>Question ${index + 1}:</strong> ${item.question}</h6>
            </div>
          </div>
  
          <div class="review-answers ms-4">
            ${item.userAnswer === -1 ?
              '<p class="text-muted mb-2"><strong>Your Answer:</strong> <em>No answer selected</em></p>' :
              `<p class="mb-2 ${item.isCorrect ? 'text-success' : 'text-danger'}">
                <strong>Your Answer:</strong> ${item.options[item.userAnswer]}
              </p>`
            }
  
            ${!item.isCorrect ?
              `<p class="text-success mb-2">
                <strong>Correct Answer:</strong> ${item.options[item.correctAnswer]}
              </p>` : ''
            }
  
            <div class="alert alert-${statusClass} alert-sm mt-2 mb-0">
              <strong>${statusText}!</strong> ${item.explanation}
            </div>
          </div>
        </div>
      `;
    });
  
    reviewDiv.innerHTML = html;
  }
  
  console.log('Script loaded successfully');
  