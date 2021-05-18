import java.awt.*;
import java.awt.event.*;

class Ex extends Frame implements ActionListener, WindowListener, FocusListener {
    private Panel panel, p;
    private Label notice, lblName, lblID;
    private TextField tfName, tfID;
    private Button submit;

    public Ex() {
        super("Form");
        setSize(350, 200);

        panel = new Panel();
        panel.setLayout(new GridLayout(3, 2));
        p = new Panel();

        notice = new Label("");
        lblName = new Label("Name:");
        lblID = new Label("Student ID:");
        tfName = new TextField(15);
        tfID = new TextField(15);
        submit = new Button("Submit");

        panel.add(lblName);
        panel.add(tfName);
        panel.add(lblID);
        panel.add(tfID);
        panel.add(notice);
        panel.add(submit);

        addWindowListener(this);
        submit.addActionListener(this);
        tfName.addFocusListener(this);
        tfID.addFocusListener(this);

        tfName.addActionListener(this);
        tfID.addActionListener(this);

        p.add(panel);
        add(p);

        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == submit) {
            notice.setText("Thanks!");
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if(e.getSource() == tfName) {
            notice.setText("Input Name");
        } else if(e.getSource() == tfID) {
            notice.setText("Input ID");
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        notice.setText("");
    }

    @Override
    public void windowOpened(WindowEvent e) {}

    @Override
    public void windowClosing(WindowEvent e) {
        try {
            Thread.sleep(100);
        } catch(Exception ignored) {}

        System.exit(0);
    }

    @Override
    public void windowClosed(WindowEvent e) {}

    @Override
    public void windowIconified(WindowEvent e) {}

    @Override
    public void windowDeiconified(WindowEvent e) {

    }

    @Override
    public void windowActivated(WindowEvent e) {

    }

    @Override
    public void windowDeactivated(WindowEvent e) {

    }
}

public class Form {
    public static void main(String[] args) {
        Ex f = new Ex();
    }
}