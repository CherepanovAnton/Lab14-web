(function() {
    class MaterialRipple {
        constructor() {
            this.init();
        }

        init() {
            const interactiveElements = document.querySelectorAll('.card, .job, .tag, button, .contact__email, .name-card, .profile-card, .edu-card, .tools__tag, .lang-bar');
            
            interactiveElements.forEach(el => {
                el.style.position = 'relative';
                el.style.overflow = 'hidden';
                el.style.cursor = 'pointer';
                el.addEventListener('click', this.createRipple.bind(this));
            });
        }

        createRipple(event) {
            const element = event.currentTarget;
            
            const existingRipple = element.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(40, 217, 121, 0.4) 0%, rgba(40, 217, 121, 0.1) 100%);
                transform: translate(${x}px, ${y}px) scale(0);
                animation: rippleAnimation 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple && ripple.remove) {
                    ripple.remove();
                }
            }, 600);
        }
    }

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleAnimation {
            from {
                transform: translate(var(--x, 0), var(--y, 0)) scale(0);
                opacity: 0.8;
            }
            to {
                transform: translate(var(--x, 0), var(--y, 0)) scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    class EditableResume {
        constructor() {
            this.editableElements = [];
            this.init();
        }

        init() {
            const selectors = [
                '.name-card__name',
                '.name-card__role',
                '.name-card__hello',
                '.languages__names li',
                '.job__title',
                '.job__company',
                '.job__list li',
                '.edu-card__degree',
                '.edu-tags',
                '.edu-card__school',
                '.tag',
                '.contact__lead',
                '.contact__email',
                '.tools__tag'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    this.makeEditable(el);
                });
            });

            this.loadFromLocalStorage();
        }

        makeEditable(element) {
            const originalText = element.textContent;
            
            element.setAttribute('contenteditable', 'true');
            element.setAttribute('data-original-text', originalText);
            element.classList.add('editable');
            
            element.addEventListener('focus', (e) => {
                element.classList.add('editing');
                this.animateElement(element, 'focus');
            });
            
            element.addEventListener('blur', (e) => {
                element.classList.remove('editing');
                this.saveToLocalStorage();
                this.animateElement(element, 'blur');
            });
            
            element.addEventListener('input', (e) => {
                this.animateElement(element, 'change');
            });
            
            this.editableElements.push(element);
        }

        animateElement(element, action) {
            switch(action) {
                case 'focus':
                    element.style.transition = 'all 0.2s ease';
                    element.style.transform = 'scale(1.02)';
                    element.style.backgroundColor = 'rgba(40, 217, 121, 0.1)';
                    break;
                case 'blur':
                    element.style.transform = 'scale(1)';
                    element.style.backgroundColor = 'transparent';
                    break;
                case 'change':
                    element.style.transform = 'scale(1.01)';
                    element.style.color = '#28d979';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                        element.style.color = '';
                    }, 200);
                    break;
            }
        }

        saveToLocalStorage() {
            const resumeData = {};
            this.editableElements.forEach(el => {
                const path = this.getElementPath(el);
                resumeData[path] = el.textContent;
            });
            localStorage.setItem('resume-editable-data', JSON.stringify(resumeData));
        }

        loadFromLocalStorage() {
            const savedData = localStorage.getItem('resume-editable-data');
            if (savedData) {
                const resumeData = JSON.parse(savedData);
                this.editableElements.forEach(el => {
                    const path = this.getElementPath(el);
                    if (resumeData[path]) {
                        el.textContent = resumeData[path];
                    }
                });
            }
        }

        getElementPath(element) {
            if (element.id) return element.id;
            
            let path = [];
            let current = element;
            while (current && current !== document.body) {
                if (current.classList && current.classList.length > 0) {
                    path.unshift(current.classList[0]);
                } else if (current.tagName) {
                    path.unshift(current.tagName.toLowerCase());
                }
                current = current.parentElement;
            }
            return path.join('>');
        }
    }

    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .editable {
            cursor: text;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 4px;
            padding: 2px 4px;
            margin: -2px -4px;
        }
        
        .editable:hover {
            background-color: rgba(40, 217, 121, 0.05);
            box-shadow: 0 0 0 1px rgba(40, 217, 121, 0.2);
        }
        
        .editable.editing {
            background-color: rgba(40, 217, 121, 0.1);
            box-shadow: 0 0 0 2px #28d979;
            outline: none;
        }
        
        @keyframes textPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes glow {
            from {
                text-shadow: 0 0 0px rgba(40, 217, 121, 0);
            }
            to {
                text-shadow: 0 0 8px rgba(40, 217, 121, 0.5);
            }
        }
        
        .job, .edu-card, .tag {
            animation: slideIn 0.3s ease-out;
        }
        
        .tag:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(animationStyles);

    class PDFExporter {
        constructor() {
            this.createDownloadButton();
        }

        createDownloadButton() {
            const button = document.createElement('button');
            button.textContent = '📄 Скачать PDF';
            button.className = 'download-pdf-btn';
            button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: #28d979;
                color: white;
                border: none;
                border-radius: 50px;
                padding: 12px 24px;
                font-family: 'Poppins', sans-serif;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });
            
            button.addEventListener('click', () => this.exportToPDF());
            
            document.body.appendChild(button);
        }

        async exportToPDF() {
            if (typeof html2pdf === 'undefined') {
                await this.loadHtml2Pdf();
            }
            
            const loadingIndicator = this.showLoading();
            
            try {
                const element = document.querySelector('.cv-page');
                const opt = {
                    margin: [0.5, 0.5, 0.5, 0.5],
                    filename: 'resume_karthik_sr.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { 
                        scale: 2,
                        letterRendering: true,
                        useCORS: true,
                        logging: false
                    },
                    jsPDF: { 
                        unit: 'in', 
                        format: 'a4', 
                        orientation: 'portrait' 
                    }
                };
                
                const originalOverflow = document.body.style.overflow;
                document.body.style.overflow = 'auto';
                
                await html2pdf().set(opt).from(element).save();
                
                document.body.style.overflow = originalOverflow;
                
            } catch (error) {
                console.error('Error creating PDF:', error);
                alert('Error creating PDF. Please try again.');
            } finally {
                this.hideLoading(loadingIndicator);
            }
        }

        loadHtml2Pdf() {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        showLoading() {
            const overlay = document.createElement('div');
            overlay.className = 'pdf-loading-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            `;
            
            const spinner = document.createElement('div');
            spinner.style.cssText = `
                width: 50px;
                height: 50px;
                border: 4px solid #ffffff;
                border-top: 4px solid #28d979;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            `;
            
            const text = document.createElement('div');
            text.textContent = 'Создание PDF...';
            text.style.cssText = `
                color: white;
                font-family: 'Poppins', sans-serif;
                font-size: 16px;
            `;
            
            const spinStyle = document.createElement('style');
            spinStyle.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinStyle);
            
            overlay.appendChild(spinner);
            overlay.appendChild(text);
            document.body.appendChild(overlay);
            
            return overlay;
        }

        hideLoading(overlay) {
            if (overlay && overlay.remove) {
                overlay.remove();
            }
        }
    }

    new MaterialRipple();
    new EditableResume();
    new PDFExporter();
})();